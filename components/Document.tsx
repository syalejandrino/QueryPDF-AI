'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import byteSize from "byte-size";
import { Trash2Icon, DownloadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

interface FileCardProps {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
}

export default function FileCard({ id, name, size, downloadUrl }: FileCardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigateToFile = () => router.push(`/dashboard/files/${id}`);

  const handleDelete = () => {
    const confirmed = window.confirm("Do you really want to remove this document?");
    if (!confirmed) return;

    startTransition(async () => {
      await deleteDocument(id);
    });
  };

  return (
    <div
      onClick={navigateToFile}
      className="flex flex-col w-64 h-80 rounded-xl border border-yellow-400 bg-[#121212] p-4 shadow-md transform transition-all hover:scale-105 hover:border-yellow-900 group cursor-pointer"
    >
      <div className="flex-1">
        <p className="font-semibold text-yellow-300 group-hover:text-yellow-200 line-clamp-2">
          {name}
        </p>
        <p className="mt-1 text-sm text-gray-400 group-hover:text-yellow-500">
          {byteSize(size).value} KB
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          className="border border-red-500 hover:bg-red-600/20"
          disabled={pending}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Trash2Icon className="h-5 w-5 text-red-500" />
        </Button>

        <Button
          variant="outline"
          className="border border-yellow-500 hover:bg-yellow-600/10"
          asChild
        >
          <a
            href={downloadUrl}
            download
            onClick={(e) => e.stopPropagation()}
          >
            <DownloadCloud className="h-5 w-5 text-yellow-400" />
          </a>
        </Button>
      </div>
    </div>
  );
}
