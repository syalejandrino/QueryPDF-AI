/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { JSX, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CheckCircleIcon,
  HammerIcon,
  SaveIcon,
  CircleArrowDown,
  RocketIcon,
  XOctagonIcon,
} from 'lucide-react';
import useUpload, { StatusText } from '@/hooks/useUpload';
import { useRouter } from 'next/navigation';

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleUpload(file);
    }
  }, []);

  const statusIcons: { [key in StatusText]: JSX.Element } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-yellow-400 animate-spin-slow" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-yellow-400" />
    ),
    [StatusText.SAVING]: (
      <SaveIcon className="h-20 w-20 text-yellow-400 animate-pulse" />
    ),
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-yellow-400 animate-bounce" />
    ),
    [StatusText.FAILED]: (
      <XOctagonIcon className="h-20 w-20 text-red-500 animate-shake" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        'application/pdf': ['.pdf'],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto text-yellow-300 mt-10 px-4">
      {/* Inline error message in center of page */}
      {status === StatusText.FAILED && (
        <div className="w-full max-w-xl bg-red-600/90 text-white px-6 py-5 rounded-xl shadow-lg flex flex-col items-center text-center gap-4">
          <XOctagonIcon className="h-10 w-10 text-white" />
          <p className="text-lg font-semibold">Upload failed</p>
          <p className="text-sm">Something went wrong while uploading your file. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-red-600 font-medium px-4 py-2 rounded hover:bg-red-100 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Upload progress section */}
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress text-yellow-500 text-5xl ${
              progress === 100 && 'hidden'
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              '--value': progress,
              '--size': '12rem',
              '--thickness': '1.2rem',
            }}
          >
            {progress}%
          </div>

          {
            // @ts-ignore
            statusIcons[status!]
          }

          {/* @ts-ignore */}
          <p className="text-yellow-400 font-medium animate-pulse">{status}</p>
        </div>
      )}

      {/* Dropzone area */}
      {!uploadInProgress && status !== StatusText.FAILED && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed w-[90%] border-yellow-400 rounded-lg
          h-96 flex items-center justify-center transition-all duration-300 cursor-pointer
          ${
            isFocused || isDragAccept
              ? 'bg-yellow-500/10'
              : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-yellow-300">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-pulse" />
                <p className="text-lg mt-2">Drop your file here...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p className="text-lg mt-2">
                  Drag & drop your PDF here, or click to browse
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
