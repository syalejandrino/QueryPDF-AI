/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

//const FREE_LIMIT = 10;
//const PRO_LIMIT = 100;

export async function askQuestion(id:string, question: string) {
    auth.protect();
    const { userId } = await auth();

    const chatRef = adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .collection("chat");

    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter(
        (doc) => doc.data().role === "human"
    );

    // limit PRO/FREE for next checkpoint -> out of scope

    const userMessage: Message = {
        role: 'human',
        message: question,
        createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    const reply = await generateLangchainCompletion(id, question);

    const aiMessage: Message = {
        role: "ai",
        message: reply,
        createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: null }
}