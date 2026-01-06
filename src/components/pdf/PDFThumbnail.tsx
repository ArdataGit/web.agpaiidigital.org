"use client";

import React, { useEffect, useState } from "react";
import { usePDFThumbnail } from "@/utils/hooks/usePDFThumbnail";
import { HiOutlineBookOpen } from "react-icons/hi";

interface PDFThumbnailProps {
  pdfUrl?: string;
  pdfFile?: File;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
  scale?: number;
}

/**
 * Component to display a thumbnail of the first page of a PDF
 * Can accept either a URL or a File object
 */
export default function PDFThumbnail({
  pdfUrl,
  pdfFile,
  alt = "PDF Preview",
  className = "w-full h-full object-cover",
  fallbackClassName = "bg-gradient-to-br from-teal-500 to-emerald-600",
  fallbackText = "",
  scale = 1.5,
}: PDFThumbnailProps) {
  const [source, setSource] = useState<string | File | null>(null);

  useEffect(() => {
    if (pdfFile) {
      setSource(pdfFile);
    } else if (pdfUrl) {
      setSource(pdfUrl);
    } else {
      setSource(null);
    }
  }, [pdfFile, pdfUrl]);

  const { dataUrl, loading, error } = usePDFThumbnail(source, scale);

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${fallbackClassName}`}>
        <div className="animate-pulse flex flex-col items-center text-white">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-[8px]">Memuat...</span>
        </div>
      </div>
    );
  }

  // Show error or fallback
  if (error || !dataUrl) {
    return (
      <div className={`flex flex-col items-center justify-center p-2 text-white ${fallbackClassName}`}>
        <HiOutlineBookOpen className="w-8 h-8 mb-1 opacity-80" />
        {fallbackText && (
          <p className="text-[8px] text-center font-bold line-clamp-2 opacity-90">
            {fallbackText}
          </p>
        )}
      </div>
    );
  }

  // Show thumbnail
  return (
    <img
      src={dataUrl}
      alt={alt}
      className={className}
    />
  );
}
