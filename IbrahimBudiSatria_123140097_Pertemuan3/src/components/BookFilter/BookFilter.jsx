import React from 'react';
import { useBooks } from '../../context/BookContext';
import './BookFilter.css';

/**
 * Komponen untuk memfilter dan mencari buku
 * Menggunakan controlled components untuk input
 */
const BookFilter = () => {
  const { filterStatus, setFilterStatus, searchQuery, setSearchQuery } = useBooks();

  // Status options untuk filter
  const statusOptions = [
    { value: 'all', label: 'Semua Buku' },
    { value: 'milik', label: 'Sudah Dimiliki' },
    { value: 'baca', label: 'Sedang Dibaca' },
    { value: 'beli', label: 'Ingin Dibeli' }
  ];

  return (
    <div className="book-filter">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari judul atau penulis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Status Filter Buttons */}
      <div className="filter-buttons">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-btn ${filterStatus === option.value ? 'active' : ''}`}
            onClick={() => setFilterStatus(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookFilter;
