import React, { useState } from 'react';
import { useBooks } from '../../context/BookContext';
import BookForm from '../BookForm/BookForm';
import './BookList.css';

/**
 * Komponen untuk menampilkan daftar buku
 * Menampilkan list dengan fitur edit dan delete
 */
const BookList = () => {
  const { getFilteredBooks, deleteBook } = useBooks();
  const [editingBook, setEditingBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredBooks = getFilteredBooks();

  /**
   * Handle edit buku
   * @param {Object} book - Buku yang akan diedit
   */
  const handleEdit = (book) => {
    setEditingBook(book);
    setShowEditModal(true);
  };

  /**
   * Handle delete buku dengan konfirmasi
   * @param {string} id - ID buku yang akan dihapus
   * @param {string} title - Judul buku untuk konfirmasi
   */
  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) {
      deleteBook(id);
    }
  };

  /**
   * Close edit modal
   */
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingBook(null);
  };

  /**
   * Mendapatkan label status dalam Bahasa Indonesia
   * @param {string} status - Status buku
   * @returns {string} - Label status
   */
  const getStatusLabel = (status) => {
    const statusLabels = {
      milik: 'Sudah Dimiliki',
      baca: 'Sedang Dibaca',
      beli: 'Ingin Dibeli'
    };
    return statusLabels[status] || status;
  };

  /**
   * Mendapatkan class badge berdasarkan status
   * @param {string} status - Status buku
   * @returns {string} - Class name
   */
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      milik: 'badge-owned',
      baca: 'badge-reading',
      beli: 'badge-wishlist'
    };
    return `status-badge ${statusClasses[status] || ''}`;
  };

  // Tampilkan empty state jika tidak ada buku
  if (filteredBooks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>Tidak ada buku ditemukan</h3>
        <p>Tambahkan buku pertama Anda atau coba filter lain</p>
      </div>
    );
  }

  return (
    <>
      <div className="book-list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-header">
              <h3 className="book-title">{book.title}</h3>
              <span className={getStatusBadgeClass(book.status)}>
                {getStatusLabel(book.status)}
              </span>
            </div>
            
            <p className="book-author">
              <span className="author-icon">✍️</span>
              {book.author}
            </p>

            <div className="book-meta">
              <small>
                Ditambahkan: {new Date(book.createdAt).toLocaleDateString('id-ID')}
              </small>
              {book.updatedAt && (
                <small>
                  Diupdate: {new Date(book.updatedAt).toLocaleDateString('id-ID')}
                </small>
              )}
            </div>

            <div className="book-actions">
              <button
                className="btn-action btn-edit"
                onClick={() => handleEdit(book)}
                title="Edit buku"
              >
                ✏️ Edit
              </button>
              <button
                className="btn-action btn-delete"
                onClick={() => handleDelete(book.id, book.title)}
                title="Hapus buku"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal untuk Edit */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BookForm bookToEdit={editingBook} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default BookList;
