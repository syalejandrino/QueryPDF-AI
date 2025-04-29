'use client';

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "File is uploading...",
  UPLOADED = "Successfully uploaded the file",
  SAVING = "File is saved to database...",
  GENERATING = "Generating... this will take a few seconds...",
  FAILED = "FAILED",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    const fileIdToUploadTo = uuidv4();

    const storageRef = ref(
      storage,
      `users/${user.id}/files/${fileIdToUploadTo}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("🔥 Upload error:", error);
        setStatus(StatusText.FAILED);
      },
      async () => {
        try {
          setStatus(StatusText.UPLOADED);

          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          setStatus(StatusText.SAVING);
          await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl: downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          });

          setStatus(StatusText.GENERATING);
          await generateEmbeddings(fileIdToUploadTo);

          setFileId(fileIdToUploadTo);
        } catch (err) {
          console.error("🔥 Post-upload error:", err);
          setStatus(StatusText.FAILED);
        }
      }
    );
  };

  return { progress, status, fileId, handleUpload };
}

export default useUpload;
