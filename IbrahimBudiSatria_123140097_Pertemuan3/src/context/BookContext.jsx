import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Membuat Context untuk Book Management
const BookContext = createContext();

/**
 * Provider component untuk BookContext
 * Mengelola semua state dan fungsi terkait manajemen buku
 */
export const BookProvider = ({ children }) => {
  // State untuk menyimpan daftar buku di localStorage
  const [books, setBooks] = useLocalStorage('books', []);
  
  // State untuk filter dan pencarian
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Menambahkan buku baru
   * @param {Object} book - Objek buku dengan title, author, dan status
   */
  const addBook = (book) => {
    const newBook = {
      id: Date.now().toString(),
      ...book,
      createdAt: new Date().toISOString()
    };
    setBooks([...books, newBook]);
  };

  /**
   * Mengupdate buku yang sudah ada
   * @param {string} id - ID buku yang akan diupdate
   * @param {Object} updatedBook - Data buku yang baru
   */
  const updateBook = (id, updatedBook) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { ...book, ...updatedBook, updatedAt: new Date().toISOString() }
        : book
    ));
  };

  /**
   * Menghapus buku berdasarkan ID
   * @param {string} id - ID buku yang akan dihapus
   */
  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  /**
   * Mendapatkan buku berdasarkan ID
   * @param {string} id - ID buku yang dicari
   * @returns {Object|undefined} - Objek buku atau undefined jika tidak ditemukan
   */
  const getBookById = (id) => {
    return books.find(book => book.id === id);
  };

  /**
   * Memfilter buku berdasarkan status dan query pencarian
   * @returns {Array} - Array buku yang sudah difilter
   */
  const getFilteredBooks = () => {
    let filtered = books;

    // Filter berdasarkan status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(book => book.status === filterStatus);
    }

    // Filter berdasarkan query pencarian (judul atau penulis)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Value yang akan di-provide ke seluruh aplikasi
  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    getFilteredBooks
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

/**
 * Custom Hook untuk menggunakan BookContext
 * @returns {Object} - Context value
 */
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export default BookContext;
