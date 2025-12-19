import React, { useState, useEffect } from 'react';
import { useBooks } from '../../context/BookContext';
import './BookForm.css';

/**
 * Komponen Form untuk menambah atau mengedit buku
 * Menggunakan controlled components untuk form handling
 */
const BookForm = ({ bookToEdit, onClose }) => {
  // State untuk form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('milik');
  const [errors, setErrors] = useState({});

  // Mengambil fungsi dari Context
  const { addBook, updateBook } = useBooks();

  // Effect untuk populate form jika ada buku yang akan diedit
  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setStatus(bookToEdit.status);
    }
  }, [bookToEdit]);

  /**
   * Validasi form input
   * @returns {boolean} - True jika valid, false jika ada error
   */
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Judul buku minimal 3 karakter';
    }

    if (!author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi';
    } else if (author.trim().length < 3) {
      newErrors.author = 'Nama penulis minimal 3 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Event object
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (!validateForm()) {
      return;
    }

    // Buat objek buku
    const bookData = {
      title: title.trim(),
      author: author.trim(),
      status
    };

    // Update atau tambah buku
    if (bookToEdit) {
      updateBook(bookToEdit.id, bookData);
    } else {
      addBook(bookData);
    }

    // Reset form
    handleReset();

    // Close modal jika ada
    if (onClose) {
      onClose();
    }
  };

  /**
   * Reset form ke nilai awal
   */
  const handleReset = () => {
    setTitle('');
    setAuthor('');
    setStatus('milik');
    setErrors({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>{bookToEdit ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>

      {/* Input Judul */}
      <div className="form-group">
        <label htmlFor="title">
          Judul Buku <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'error' : ''}
          placeholder="Masukkan judul buku"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      {/* Input Penulis */}
      <div className="form-group">
        <label htmlFor="author">
          Penulis <span className="required">*</span>
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={errors.author ? 'error' : ''}
          placeholder="Masukkan nama penulis"
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>

      {/* Select Status */}
      <div className="form-group">
        <label htmlFor="status">
          Status <span className="required">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="milik">Sudah Dimiliki</option>
          <option value="baca">Sedang Dibaca</option>
          <option value="beli">Ingin Dibeli</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {bookToEdit ? 'Update Buku' : 'Tambah Buku'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
        {onClose && (
          <button type="button" className="btn btn-cancel" onClick={onClose}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
