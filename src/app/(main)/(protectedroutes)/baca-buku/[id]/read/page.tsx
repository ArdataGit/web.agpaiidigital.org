"use client";

import TopBar from "@/components/nav/topbar";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { getBookById, Book } from "@/constants/books-data";
import { getUserBookById } from "@/utils/books-storage";
import * as pdfjsLib from "pdfjs-dist";

// React Icons
import {
  BsChevronLeft,
  BsChevronRight,
  BsZoomIn,
  BsZoomOut,
  BsDownload,
  BsFullscreen,
} from "react-icons/bs";
import { HiOutlineBookOpen } from "react-icons/hi";

// Set worker path
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const BookReaderPage = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [pageImage, setPageImage] = useState<string | null>(null);
  
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    if (bookId) {
      // Try to find in user books first, then in dummy books
      let foundBook = getUserBookById(bookId);
      if (!foundBook) {
        foundBook = getBookById(bookId);
      }
      setBook(foundBook || null);
      setLoading(false);
    }
  }, [bookId]);

  // Load PDF when book is available
  useEffect(() => {
    if (book?.pdfUrl) {
      loadPdf(book.pdfUrl);
    } else {
      setPdfLoading(false);
    }
  }, [book]);

  const loadPdf = async (url: string) => {
    try {
      setPdfLoading(true);
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      await renderPage(1, pdf);
    } catch (error) {
      console.error("Error loading PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const renderPage = async (pageNum: number, pdfDoc?: any) => {
    const pdf = pdfDoc || pdfDocRef.current;
    if (!pdf) return;

    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: scale * 2 }); // Higher quality

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      setPageImage(canvas.toDataURL("image/jpeg", 0.9));
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      renderPage(pageNum);
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.25, 3);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
  };

  // Re-render when scale changes
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [scale]);

  const handleDownload = () => {
    if (book?.pdfUrl) {
      const link = document.createElement("a");
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-[4.2rem]">
        <TopBar withBackButton>
          <span className="text-white">Baca Buku</span>
        </TopBar>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[4.2rem]">
        <TopBar withBackButton>Baca Buku</TopBar>
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <HiOutlineBookOpen className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">Buku tidak ditemukan</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // If no PDF URL, show placeholder
  if (!book.pdfUrl) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[4.2rem]">
        <TopBar withBackButton>Baca Buku</TopBar>
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <HiOutlineBookOpen className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-gray-600 text-center font-medium mb-2">
            Preview belum tersedia
          </p>
          <p className="text-gray-400 text-sm text-center mb-4">
            File PDF untuk buku ini belum diunggah
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium"
          >
            Kembali ke Detail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-teal-700 px-4 py-3">
        <div className="max-w-[480px] mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 text-white hover:bg-teal-600 rounded-lg transition-colors"
          >
            <BsChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1 px-4">
            <h1 className="text-white font-medium text-sm line-clamp-1">
              {book.title}
            </h1>
            <p className="text-teal-200 text-xs">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="p-2 text-white hover:bg-teal-600 rounded-lg transition-colors"
          >
            <BsDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 pt-16 pb-20 overflow-auto">
        {pdfLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Memuat dokumen...</p>
            </div>
          </div>
        ) : pageImage ? (
          <div className="flex justify-center p-4">
            <img
              src={pageImage}
              alt={`Halaman ${currentPage}`}
              className="max-w-full h-auto shadow-2xl"
              style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Gagal memuat halaman</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="max-w-[480px] mx-auto">
          {/* Page Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              <BsChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-14 px-2 py-1 text-center bg-gray-700 text-white rounded border border-gray-600 text-sm"
              />
              <span className="text-gray-400 text-sm">/ {totalPages}</span>
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <BsChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <BsZoomOut className="w-4 h-4" />
            </button>
            <span className="text-gray-400 text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <BsZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReaderPage;
