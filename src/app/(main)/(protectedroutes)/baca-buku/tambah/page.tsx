"use client";

import TopBar from "@/components/nav/topbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { bookCategories, Book } from "@/constants/books-data";
import { generatePDFThumbnail } from "@/utils/hooks/usePDFThumbnail";
import { addUserBook } from "@/utils/books-storage";

// React Icons
import {
  BsFileEarmarkPdf,
  BsX,
  BsCheckCircle,
} from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";

// Jenjang options
const jenjangOptions = [
  "SD Kelas 1",
  "SD Kelas 2",
  "SD Kelas 3",
  "SD Kelas 4",
  "SD Kelas 5",
  "SD Kelas 6",
  "SMP Kelas 7",
  "SMP Kelas 8",
  "SMP Kelas 9",
  "SMA/SMK Kelas 10",
  "SMA/SMK Kelas 11",
  "SMA/SMK Kelas 12",
  "Umum",
];

const TambahBukuPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    jenjang: "",
    description: "",
    publisher: "",
    year: "",
    pages: "",
    isbn: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert file to data URL for storage
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle PDF upload and auto-generate cover from first page
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Silakan pilih file PDF");
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("Ukuran file maksimal 50MB");
      return;
    }

    setPdfFile(file);
    setCoverPreview(null);
    setIsGeneratingCover(true);

    try {
      // Convert PDF to data URL for storage
      const dataUrl = await fileToDataUrl(file);
      setPdfDataUrl(dataUrl);

      // Generate cover from first page of PDF
      const thumbnail = await generatePDFThumbnail(file, 2);
      setCoverPreview(thumbnail);
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfDataUrl(null);
    setCoverPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.category) {
      alert("Mohon lengkapi judul, penulis, dan kategori buku");
      return;
    }

    if (!pdfFile || !pdfDataUrl) {
      alert("Mohon upload file PDF buku");
      return;
    }

    setIsSubmitting(true);

    try {
      const newBook: Book = {
        id: `user-${Date.now()}`,
        title: formData.title,
        author: formData.author,
        category: formData.category,
        jenjang: formData.jenjang || undefined,
        description: formData.description || undefined,
        publisher: formData.publisher || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        isbn: formData.isbn || undefined,
        cover: coverPreview || "/images/books/default.jpg",
        coverDataUrl: coverPreview || undefined,
        pdfUrl: pdfDataUrl,
        uploadDate: new Date().toISOString().split("T")[0],
        viewCount: 0,
        downloadCount: 0,
        likeCount: 0,
        isNew: true,
      };

      addUserBook(newBook);
      alert("Buku berhasil ditambahkan!");
      router.push("/baca-buku");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Gagal menambahkan buku. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar withBackButton>Tambah Buku</TopBar>

      <div className="max-w-[480px] mx-auto pt-[3.8rem] pb-6 px-4">
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {/* PDF Upload Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Upload File e-Book (PDF)</h3>
              <p className="text-xs text-gray-500 mt-1">
                Sampul buku akan diambil otomatis dari halaman pertama PDF
              </p>
            </div>

            <div className="p-5">
              {pdfFile ? (
                <div className="space-y-4">
                  {/* PDF Info */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                        <BsCheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {pdfFile.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <BsX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Cover Preview */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2 font-medium">Preview Sampul:</p>
                    <div className="w-28 mx-auto">
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg border border-gray-100">
                        {isGeneratingCover ? (
                          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-600 flex flex-col items-center justify-center text-white">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-[9px]">Memuat...</span>
                          </div>
                        ) : coverPreview ? (
                          <img
                            src={coverPreview}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-600 flex flex-col items-center justify-center p-2 text-white">
                            <HiOutlineBookOpen className="w-6 h-6 mb-1" />
                            <span className="text-[7px] text-center">Preview tidak tersedia</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <BsFileEarmarkPdf className="w-7 h-7 text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 mb-1">Pilih File PDF</span>
                  <span className="text-[10px] text-gray-400 mb-3">Maksimal 50MB</span>
                  <span className="px-4 py-2 bg-teal-600 text-white text-xs rounded-lg font-medium">
                    Browse File
                  </span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Book Information Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Informasi Buku</h3>
            </div>

            <div className="p-5 space-y-4">
              {/* Nama Buku */}
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Nama Buku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul buku"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Penulis */}
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Nama penulis buku"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Kategori & Jenjang Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    required
                  >
                    <option value="">Pilih</option>
                    {bookCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">
                    Jenjang Buku
                  </label>
                  <select
                    name="jenjang"
                    value={formData.jenjang}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Pilih</option>
                    {jenjangOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Halaman & Tahun Terbit Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Halaman</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="Jumlah halaman"
                    min="1"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Tahun Terbit</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="2024"
                    min="1900"
                    max="2100"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Penerbit & ISBN Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Penerbit</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="Nama penerbit"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    placeholder="978-xxx-xxx"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsi singkat tentang buku ini..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Submit Button - Inside Card */}
            <div className="px-5 pb-5">
              <button
                type="submit"
                disabled={isSubmitting || !pdfFile}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white rounded-lg font-semibold text-sm transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaBookOpen className="w-4 h-4" />
                    Tambah Buku
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Note */}
          <p className="text-[10px] text-gray-400 text-center px-4">
            Dengan menambahkan buku, Anda menyetujui bahwa konten yang diunggah tidak melanggar hak cipta.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TambahBukuPage;
