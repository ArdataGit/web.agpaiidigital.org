"use client";

import TopBar from "@/components/nav/topbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { dummyBooks, Book } from "@/constants/books-data";

// React Icons
import {
  BsBookmark,
  BsTrash,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";

const KoleksiBukuPage = () => {
  const router = useRouter();
  // Simulated saved books (first 3 books for demo)
  const [myBooks, setMyBooks] = useState<Book[]>(dummyBooks.slice(0, 3));
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleBookClick = (bookId: string) => {
    router.push(`/baca-buku/${bookId}`);
  };

  const handleRemoveBook = (bookId: string) => {
    setMyBooks(myBooks.filter((book) => book.id !== bookId));
    setShowMenu(null);
  };

  // Get gradient colors based on category
  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      "Bahasa Inggris": "from-blue-400 to-blue-600",
      "Bahasa Indonesia": "from-red-400 to-rose-600",
      "Matematika": "from-green-400 to-emerald-600",
      "IPA": "from-cyan-400 to-teal-600",
      "IPS": "from-amber-400 to-orange-600",
      "PKn": "from-red-500 to-red-700",
      "Pendidikan Agama": "from-emerald-500 to-green-700",
      "Seni Budaya": "from-purple-400 to-violet-600",
      "PJOK": "from-orange-400 to-red-600",
      "Informatika": "from-indigo-400 to-blue-600",
    };
    return gradients[category] || "from-teal-500 to-emerald-600";
  };

  const BookCard = ({ book }: { book: Book }) => {
    // Use coverDataUrl (PDF generated) if available, otherwise use cover URL
    const coverSrc = book.coverDataUrl || book.cover;
    
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm flex gap-3 relative">
        {/* Book Cover */}
        <div
          onClick={() => handleBookClick(book.id)}
          className="w-20 flex-shrink-0 cursor-pointer"
        >
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-gray-200">
            {/* Book Cover Image */}
            <img
              src={coverSrc}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
          {/* Fallback Placeholder (hidden by default) */}
          <div 
            className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(book.category)} flex-col items-center justify-center p-2 text-white`}
            style={{ display: 'none' }}
          >
            <HiOutlineBookOpen className="w-6 h-6 mb-1" />
            <p className="text-[7px] text-center font-bold line-clamp-2 px-0.5">{book.title}</p>
          </div>
        </div>
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0" onClick={() => handleBookClick(book.id)}>
        <span className="inline-block bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full font-medium mb-1">
          {book.category}
        </span>
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-0.5">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBookClick(book.id);
          }}
          className="mt-2 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs rounded-lg font-medium"
        >
          Baca
        </button>
      </div>

      {/* Menu Button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(showMenu === book.id ? null : book.id);
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <BsThreeDotsVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown Menu */}
        {showMenu === book.id && (
          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-10 min-w-[120px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveBook(book.id);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 text-xs"
            >
              <BsTrash className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[3.8rem] pb-6">
      <TopBar withBackButton>Buku Saya</TopBar>

      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-600 to-emerald-700 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <BsBookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold">Koleksi Buku Saya</h2>
            <p className="text-teal-100 text-sm">{myBooks.length} buku tersimpan</p>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="px-4 py-5">
        {myBooks.length > 0 ? (
          <div className="space-y-3">
            {myBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FaBookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-center mb-2">Belum ada buku tersimpan</p>
            <p className="text-gray-400 text-sm text-center mb-4">
              Simpan buku favoritmu untuk dibaca nanti
            </p>
            <button
              onClick={() => router.push("/baca-buku")}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-sm font-medium"
            >
              Jelajahi Buku
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KoleksiBukuPage;
