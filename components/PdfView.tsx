'use client';

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { Document, Page, pdfjs } from "react-pdf";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";


interface PdfReaderProps {
  url: string;
}

export default function PdfReader({ url }: PdfReaderProps) {
  const [blobFile, setBlobFile] = useState<Blob | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageField, setPageField] = useState("1");
  const [viewRotation, setViewRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [fieldError, setFieldError] = useState(false);

  useEffect(() => {
    async function loadPdf() {
      try {
        setFetching(true);
        const res = await fetch(url);
        const pdfBlob = await res.blob();
        setBlobFile(pdfBlob);
      } catch (err) {
        console.error("⚡ Failed to retrieve PDF file.", err);
      } finally {
        setFetching(false);
      }
    }

    loadPdf();
  }, [url]);

  const onDocumentReady = ({ numPages }: { numPages: number }) => {
    setPages(numPages);
    setCurrent(1);
    setPageField("1");
    setFieldError(false);
  };

  const jumpToPage = () => {
    const pageNum = parseInt(pageField, 10);
    if (!isNaN(pageNum) && pages && pageNum >= 1 && pageNum <= pages) {
      setCurrent(pageNum);
      setFieldError(false);
    } else {
      setFieldError(true);
    }
  };

  const nextPage = () => {
    if (pages) {
      setCurrent((prev) => Math.min(prev + 1, pages));
    }
  };

  const previousPage = () => {
    setCurrent((prev) => Math.max(prev - 1, 1));
  };

  const rotateClockwise = () => {
    setViewRotation((prev) => (prev + 90) % 360);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 1.5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.75));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="sticky top-0 w-full bg-gray-100 border-b border-gray-300 z-50 px-4 py-3">
        <div className="flex flex-wrap justify-center items-center gap-3 max-w-6xl mx-auto">
          <Button variant="outline" disabled={current <= 1} onClick={previousPage}>
            Previous
          </Button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={pages ?? 1}
                value={pageField}
                onChange={(e) => {
                  setPageField(e.target.value);
                  setFieldError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && jumpToPage()}
                className={`w-16 px-2 py-1 text-sm text-center rounded-md border ${
                  fieldError ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span className="text-sm">/ {pages ?? "?"}</span>
            </div>
            {fieldError && (
              <span className="text-xs text-red-500">Invalid page number</span>
            )}
          </div>

          <Button variant="outline" disabled={!pages || current >= pages} onClick={nextPage}>
            Next
          </Button>

          <Button variant="outline" onClick={rotateClockwise}>
            <RotateCw />
          </Button>

          <Button variant="outline" disabled={zoom >= 1.5} onClick={zoomIn}>
            <ZoomInIcon />
          </Button>

          <Button variant="outline" disabled={zoom <= 0.75} onClick={zoomOut}>
            <ZoomOutIcon />
          </Button>
        </div>
      </div>

      {fetching ? (
        <Loader2Icon className="h-20 w-20 text-indigo-600 animate-spin mt-20" />
      ) : blobFile ? (
        <Document
          file={blobFile}
          onLoadSuccess={onDocumentReady}
          loading={null}
          className="m-4 overflow-scroll"
        >
          <Page
            className="shadow-lg"
            pageNumber={current}
            scale={zoom}
            rotate={viewRotation}
          />
        </Document>
      ) : (
        <p className="text-red-500 mt-10">Unable to load PDF content.</p>
      )}
    </div>
  );
}
