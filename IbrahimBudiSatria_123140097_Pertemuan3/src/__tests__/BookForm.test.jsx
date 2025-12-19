import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookProvider } from '../context/BookContext';
import BookForm from '../components/BookForm/BookForm';

/**
 * Test Suite untuk BookForm Component
 * Menguji fungsionalitas form input dan validasi
 */
describe('BookForm Component', () => {
  // Setup sebelum setiap test
  beforeEach(() => {
    render(
      <BookProvider>
        <BookForm />
      </BookProvider>
    );
  });

  /**
   * Test 1: Rendering Form Elements
   * Memastikan semua elemen form ter-render dengan benar
   */
  it('should render all form elements', () => {
    // Cek judul form
    expect(screen.getByText('Tambah Buku Baru')).toBeInTheDocument();
    
    // Cek input fields
    expect(screen.getByLabelText(/judul buku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/penulis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    
    // Cek tombol
    expect(screen.getByRole('button', { name: /tambah buku/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  /**
   * Test 2: Input Validation - Empty Fields
   * Memastikan validasi bekerja untuk field kosong
   */
  it('should show validation errors for empty fields', () => {
    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    
    // Klik submit tanpa mengisi form
    fireEvent.click(submitButton);
    
    // Cek error messages
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();
  });

  /**
   * Test 3: Input Validation - Minimum Length
   * Memastikan validasi minimum karakter bekerja
   */
  it('should show validation errors for short inputs', () => {
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    const submitButton = screen.getByRole('button', { name: /tambah buku/i });
    
    // Isi dengan input yang terlalu pendek
    fireEvent.change(titleInput, { target: { value: 'ab' } });
    fireEvent.change(authorInput, { target: { value: 'cd' } });
    fireEvent.click(submitButton);
    
    // Cek error messages
    expect(screen.getByText(/judul buku minimal 3 karakter/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis minimal 3 karakter/i)).toBeInTheDocument();
  });

  /**
   * Test 4: Input Values Update
   * Memastikan nilai input berubah saat user mengetik
   */
  it('should update input values when user types', () => {
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    
    // Isi input
    fireEvent.change(titleInput, { target: { value: 'Clean Code' } });
    fireEvent.change(authorInput, { target: { value: 'Robert Martin' } });
    
    // Cek nilai input
    expect(titleInput.value).toBe('Clean Code');
    expect(authorInput.value).toBe('Robert Martin');
  });

  /**
   * Test 5: Reset Button Functionality
   * Memastikan tombol reset membersihkan form
   */
  it('should clear form when reset button is clicked', () => {
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    
    // Isi form
    fireEvent.change(titleInput, { target: { value: 'Clean Code' } });
    fireEvent.change(authorInput, { target: { value: 'Robert Martin' } });
    
    // Klik reset
    fireEvent.click(resetButton);
    
    // Cek form kosong
    expect(titleInput.value).toBe('');
    expect(authorInput.value).toBe('');
  });
});
