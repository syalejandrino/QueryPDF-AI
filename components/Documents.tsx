import { auth } from "@clerk/nextjs/server";
import PlaceholderDocument from "./PlaceholderDocument";
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";

async function Documents() {
  auth.protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  const hasDocuments = documentsSnapshot.size > 0;

  return (
    <section className="flex flex-wrap gap-6 p-6 rounded-xl border border-yellow-500/20 shadow-inner bg-[#0e0e0e] transition-all">
      {hasDocuments ? (
        documentsSnapshot.docs.map((doc) => {
          const { name, downloadUrl, size } = doc.data();

          return (
            <Document
              key={doc.id}
              id={doc.id}
              name={name}
              size={size}
              downloadUrl={downloadUrl}
            />
          );
        })
      ) : (
        <div className="text-center w-full py-10 text-gray-500 italic">
          No documents uploaded yet. Start by uploading your first PDF.
        </div>
      )}

      <PlaceholderDocument />
    </section>
  );
}

export default Documents;
