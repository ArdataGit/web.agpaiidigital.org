"use client";

import FormControl from "@/components/form/form_control";
import API from "@/utils/api/config";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronLeftIcon, ClipboardIcon } from "@heroicons/react/24/solid";
import Loader from "@/components/loader/loader";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { getErrorMessage } from "@/utils/error-handler";
import { useRouter } from "next/navigation";

export default function SearchEmailByName() {
  interface iFormField {
    name: string;
  }

  interface iEmailResult {
    email: string;
    name: string;
  }

  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<iFormField>({
    defaultValues: { name: "" },
  });
  const [results, setResults] = useState<iEmailResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const { mutate: searchEmails } = useMutation({
    mutationFn: async (data: iFormField) => {
      try {
        const res = await API.post("/search-email-by-name", {
          name: data.name,
        });
        if (res.status === 200) return res.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw error.response.data;
        } else {
          throw error;
        }
      }
    },
    onError: (err: any) => {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      setResults(data.emails || []);
      setCurrentPage(1);
    },
  });

  // Watch name input for debounced search
  const nameValue = watch("name");

  // Debounced search function
  const debouncedSearch = debounce((name: string) => {
    if (name.length >= 2) {
      setIsLoading(true);
      searchEmails({ name }, { onSettled: () => setIsLoading(false) });
    } else {
      setResults([]);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(nameValue);
    return () => debouncedSearch.cancel();
  }, [nameValue]);

  // Function to copy email to clipboard
  const copyToClipboard = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast.success("Email berhasil disalin!");
      })
      .catch(() => {
        toast.error("Gagal menyalin email.");
      });
  };

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  // Generate pagination buttons
  const getPaginationRange = () => {
    const maxVisiblePages = 5;
    const sidePages = 2;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > sidePages + 2) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - sidePages);
      const endPage = Math.min(totalPages - 1, currentPage + sidePages);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - sidePages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-6">
        <button onClick={() => router.back()} className="p-1">
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-medium text-gray-700">Cari Email</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(searchEmails as any)}
        method="POST"
        className="flex-1 flex flex-col px-6 pt-4"
      >
        <p className="text-center text-slate-600 mb-6">
          Cari email berdasarkan nama profil (minimal 2 karakter)
        </p>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Masukkan nama (min. 2 karakter)"
            className="w-full px-4 py-3 border-2 border-[#00AF70] rounded-lg focus:outline-none focus:border-[#00AF70] placeholder-gray-400"
            required
            minLength={2}
          />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader className="size-8" />
          </div>
        )}

        {/* No Results Message */}
        {results.length === 0 && nameValue.length >= 2 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">
              Tidak ada hasil ditemukan untuk "{nameValue}".
            </p>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Ditemukan {results.length} hasil:
            </p>
            {currentResults.map((result, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border-2 border-[#00AF70] hover:bg-gray-50 transition"
              >
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Nama:</span>
                    <p className="font-medium text-gray-700">{result.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="text-sm text-gray-700 break-all">{result.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.email)}
                      className="ml-3 flex items-center gap-1 text-xs text-[#00AF70] hover:text-[#008f5f] transition flex-shrink-0"
                      title="Salin Email"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {results.length > resultsPerPage && (
          <div className="mt-4 mb-8 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
              >
                Sebelumnya
              </button>
              {getPaginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-2 text-sm text-gray-600">
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`px-3 py-2 text-sm rounded-lg transition ${
                      currentPage === page
                        ? "bg-[#00AF70] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {/* Back to Login Link */}
        {results.length === 0 && !isLoading && (
          <div className="mt-auto pb-8">
            <p className="text-sm text-center text-slate-600">
              Sudah ingat email Anda?{" "}
              <Link
                href={"/auth/login"}
                className="text-[#00AF70] font-medium hover:underline"
              >
                Login Sekarang
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
