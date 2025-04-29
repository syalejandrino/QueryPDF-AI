'use server'

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string){
    auth.protect();
    const { userId } = await auth();

    // Delete the document from the database
    await adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(docId)
        .delete();
    
    // Delete from firebase storage
    await adminStorage
        .bucket(process.env.FIREBASE_STORAGE_BUCKET)
        .file(`users/${userId}/files/${docId}`)
        .delete();

    //Revalidate the dashboard
    revalidatePath("/dashboard");
}