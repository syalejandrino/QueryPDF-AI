'use client';
import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function UploadPlaceholder() {
  const navigation = useRouter();

  const redirectToUpload = () => {
    navigation.push("/dashboard/upload");
  };

  return (
    <Button
      onClick={redirectToUpload}
      className="h-80 w-64 flex flex-col items-center justify-center bg-gray-200 text-gray-400 rounded-lg shadow-md"
    >
      <PlusCircleIcon size={64} />
      <span>Upload a File</span>
    </Button>
  );
}