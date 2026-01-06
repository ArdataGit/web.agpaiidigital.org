// Dummy book data for Baca Buku feature
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string; // URL to cover image OR data URL from PDF thumbnail
  pdfUrl?: string; // URL to the PDF file
  category: string;
  jenjang?: string; // Level: SD, SMP, SMA/SMK, etc.
  description?: string;
  publisher?: string;
  year?: number;
  pages?: number;
  isbn?: string;
  isPopular?: boolean;
  isNew?: boolean;
  // Statistics
  viewCount?: number;
  downloadCount?: number;
  likeCount?: number;
  // Upload info
  uploadDate?: string; // ISO date string
  uploadedBy?: string;
  // For dynamically generated thumbnails
  coverDataUrl?: string; // Base64 data URL generated from PDF first page
}

export const bookCategories = [
  "Bahasa Inggris",
  "Bahasa Indonesia",
  "Matematika",
  "IPA",
  "IPS",
  "PKn",
  "Pendidikan Agama",
  "Seni Budaya",
  "PJOK",
  "Informatika",
];

export const dummyBooks: Book[] = [
  {
    id: "1",
    title: "English for Nusantara",
    author: "Ika Samsiyah S.Pd",
    cover: "/images/books/English.png",
    category: "Bahasa Inggris",
    jenjang: "SMA/SMK Kelas 11",
    description: "Buku pembelajaran Bahasa Inggris untuk siswa Indonesia dengan pendekatan kontekstual Nusantara. Buku ini menyajikan aktivitas pembelajaran kontekstual yang bermakna dan berkaitan langsung dengan lingkungan sekitar, membantu siswa memahami dan mengamalkan komunikasi bahasa Inggris dalam kehidupan sehari-hari.",
    publisher: "Kemendikbud",
    year: 2023,
    pages: 180,
    isbn: "978-602-1234-01-1",
    isPopular: true,
    viewCount: 1250,
    downloadCount: 55,
    likeCount: 43,
    uploadDate: "2025-12-20",
  },
  {
    id: "2",
    title: "Pendidikan Pancasila",
    author: "Yunita Suciati S.Pd",
    cover: "/images/books/PendidikanPancasila.png",
    category: "PKn",
    jenjang: "SMA/SMK Kelas 11",
    description: "Buku Pendidikan Pancasila ini menyajikan aktivitas pembelajaran kontekstual yang bermakna dan berkaitan langsung dengan lingkungan sekitar, membantu siswa memahami dan mengamalkan nilai-nilai Pancasila dalam kehidupan sehari-hari.\n\nBuku ini menuntun siswa untuk belajar dan bekerja secara nyata, menjadikan Pendidikan Pancasila sebagai mata pelajaran yang disukai, serta membentuk peserta didik agar memiliki karakter profil Pancasila.\n\nMelalui buku ini, siswa akan diajak untuk menumbuhkan sikap dan keterampilan yang dibutuhkan agar dapat menjaga kekayaan berupa keragaman masyarakat Indonesia.",
    publisher: "Kemendikbud",
    year: 2025,
    pages: 250,
    isbn: "978-602-1234-02-2",
    isPopular: true,
    viewCount: 70,
    downloadCount: 55,
    likeCount: 43,
    uploadDate: "2025-12-20",
  },
  {
    id: "3",
    title: "Matematika",
    author: "Ika Samsiyah S.Pd",
    cover: "/images/books/Matematika.png",
    category: "Matematika",
    jenjang: "SMP Kelas 8",
    description: "Buku Matematika dengan pendekatan problem solving dan pemecahan masalah kontekstual.",
    publisher: "Kemendikbud",
    year: 2023,
    pages: 220,
    isbn: "978-602-1234-03-3",
    isPopular: true,
    viewCount: 1500,
    downloadCount: 120,
    likeCount: 89,
    uploadDate: "2025-11-15",
  },
  {
    id: "4",
    title: "Bahasa Indonesia",
    author: "Ahmad Rizki M.Pd",
    cover: "/images/books/BahasaIndonesia.jpg",
    category: "Bahasa Indonesia",
    jenjang: "SMA/SMK Kelas 10",
    description: "Buku pembelajaran Bahasa Indonesia dengan fokus pada literasi dan keterampilan berbahasa.",
    publisher: "Kemendikbud",
    year: 2023,
    pages: 200,
    isbn: "978-602-1234-04-4",
    isNew: true,
    viewCount: 450,
    downloadCount: 32,
    likeCount: 28,
    uploadDate: "2025-12-18",
  },
  {
    id: "5",
    title: "IPA Terpadu",
    author: "Dr. Budi Santoso",
    cover: "/images/books/ipa.jpg",
    category: "IPA",
    jenjang: "SMP Kelas 7",
    description: "Buku IPA dengan pendekatan terpadu antara Fisika, Kimia, dan Biologi.",
    publisher: "Kemendikbud",
    year: 2024,
    pages: 280,
    isbn: "978-602-1234-05-5",
    isNew: true,
    viewCount: 320,
    downloadCount: 45,
    likeCount: 38,
    uploadDate: "2025-12-10",
  },
  {
    id: "6",
    title: "IPS Terpadu",
    author: "Dra. Siti Nurhaliza",
    cover: "/images/books/ips.jpg",
    category: "IPS",
    jenjang: "SMP Kelas 9",
    description: "Buku IPS dengan materi terintegrasi Geografi, Ekonomi, Sejarah, dan Sosiologi.",
    publisher: "Kemendikbud",
    year: 2024,
    pages: 240,
    isbn: "978-602-1234-06-6",
    isNew: true,
    viewCount: 280,
    downloadCount: 22,
    likeCount: 19,
    uploadDate: "2025-12-05",
  },
  {
    id: "7",
    title: "Pendidikan Agama Islam",
    author: "Ustadz Abdullah",
    cover: "/images/books/pai.jpg",
    category: "Pendidikan Agama",
    jenjang: "SMA/SMK Kelas 12",
    description: "Buku Pendidikan Agama Islam dan Budi Pekerti untuk membentuk karakter islami.",
    publisher: "Kemendikbud",
    year: 2023,
    pages: 168,
    isbn: "978-602-1234-07-7",
    isPopular: true,
    viewCount: 890,
    downloadCount: 78,
    likeCount: 65,
    uploadDate: "2025-11-20",
  },
  {
    id: "8",
    title: "Seni Budaya",
    author: "Dewi Kusuma S.Sn",
    cover: "/images/books/seni-budaya.jpg",
    category: "Seni Budaya",
    jenjang: "SMP Kelas 8",
    description: "Buku Seni Budaya mencakup seni rupa, musik, tari, dan teater tradisional Indonesia.",
    publisher: "Kemendikbud",
    year: 2023,
    pages: 144,
    isbn: "978-602-1234-08-8",
    viewCount: 210,
    downloadCount: 15,
    likeCount: 12,
    uploadDate: "2025-10-25",
  },
  {
    id: "9",
    title: "PJOK",
    author: "Rudi Hartono M.Or",
    cover: "/images/books/pjok.jpg",
    category: "PJOK",
    jenjang: "SD Kelas 6",
    description: "Buku Pendidikan Jasmani, Olahraga, dan Kesehatan untuk gaya hidup aktif dan sehat.",
    publisher: "Kemendikbud",
    year: 2024,
    pages: 132,
    isbn: "978-602-1234-09-9",
    isNew: true,
    viewCount: 175,
    downloadCount: 18,
    likeCount: 14,
    uploadDate: "2025-12-22",
  },
  {
    id: "10",
    title: "Informatika",
    author: "Dr. Andi Wijaya M.Kom",
    cover: "/images/books/informatika.jpg",
    category: "Informatika",
    jenjang: "SMA/SMK Kelas 10",
    description: "Buku Informatika dengan materi computational thinking dan pemrograman dasar.",
    publisher: "Kemendikbud",
    year: 2024,
    pages: 196,
    isbn: "978-602-1234-10-0",
    isPopular: true,
    isNew: true,
    viewCount: 650,
    downloadCount: 95,
    likeCount: 72,
    uploadDate: "2025-12-15",
  },
];

// Get books with most likes (Terfavorit)
export const getMostLikedBooks = (limit: number = 6) => {
  return [...dummyBooks]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, limit);
};

// Get books with most views (Terlaris)
export const getMostViewedBooks = (limit: number = 6) => {
  return [...dummyBooks]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);
};

export const getPopularBooks = () => {
  return dummyBooks.filter((book) => book.isPopular).slice(0, 6);
};

export const getNewBooks = () => {
  return dummyBooks.filter((book) => book.isNew).slice(0, 6);
};

export const getBooksByCategory = (category: string) => {
  return dummyBooks.filter((book) => book.category === category);
};

export const getBookById = (id: string) => {
  return dummyBooks.find((book) => book.id === id);
};

export const searchBooks = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return dummyBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.category.toLowerCase().includes(lowerQuery)
  );
};
