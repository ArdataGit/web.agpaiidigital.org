// Utilities for managing user-added books in localStorage
import { Book } from "@/constants/books-data";

const USER_BOOKS_KEY = "user_books";

/**
 * Get all user-added books from localStorage
 */
export const getUserBooks = (): Book[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USER_BOOKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading user books:", error);
    return [];
  }
};

/**
 * Save user books to localStorage
 */
export const saveUserBooks = (books: Book[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_BOOKS_KEY, JSON.stringify(books));
  } catch (error) {
    console.error("Error saving user books:", error);
  }
};

/**
 * Add a new book to localStorage
 */
export const addUserBook = (book: Book) => {
  const books = getUserBooks();
  books.unshift(book); // Add to beginning
  saveUserBooks(books);
};

/**
 * Remove a book from localStorage by ID
 */
export const removeUserBook = (bookId: string) => {
  const books = getUserBooks();
  const filtered = books.filter((book) => book.id !== bookId);
  saveUserBooks(filtered);
};

/**
 * Update a book in localStorage
 */
export const updateUserBook = (bookId: string, updates: Partial<Book>) => {
  const books = getUserBooks();
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updates };
    saveUserBooks(books);
  }
};

/**
 * Get a specific user book by ID
 */
export const getUserBookById = (bookId: string): Book | undefined => {
  const books = getUserBooks();
  return books.find((book) => book.id === bookId);
};

/**
 * Increment view count for a book
 */
export const incrementViewCount = (bookId: string) => {
  const book = getUserBookById(bookId);
  if (book) {
    updateUserBook(bookId, { viewCount: (book.viewCount || 0) + 1 });
  }
};

/**
 * Increment download count for a book
 */
export const incrementDownloadCount = (bookId: string) => {
  const book = getUserBookById(bookId);
  if (book) {
    updateUserBook(bookId, { downloadCount: (book.downloadCount || 0) + 1 });
  }
};

/**
 * Toggle like for a book
 */
export const toggleBookLike = (bookId: string, isLiked: boolean) => {
  const book = getUserBookById(bookId);
  if (book) {
    const currentLikes = book.likeCount || 0;
    updateUserBook(bookId, { 
      likeCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1) 
    });
  }
};
