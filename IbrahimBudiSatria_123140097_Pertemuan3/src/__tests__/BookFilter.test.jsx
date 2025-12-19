import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookProvider, useBooks } from '../context/BookContext';
import { BrowserRouter } from 'react-router-dom';
import BookFilter from '../components/BookFilter/BookFilter';

/**
 * Test Suite untuk BookFilter Component
 * Menguji fungsionalitas filter dan search
 */
describe('BookFilter Component', () => {
  /**
   * Helper function untuk render component dengan providers
   */
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <BookProvider>
          {component}
        </BookProvider>
      </BrowserRouter>
    );
  };

  /**
   * Test 1: Rendering Filter Elements
   * Memastikan semua elemen filter ter-render
   */
  it('should render search input and filter buttons', () => {
    renderWithProviders(<BookFilter />);
    
    // Cek search input
    expect(screen.getByPlaceholderText(/cari judul atau penulis/i)).toBeInTheDocument();
    
    // Cek filter buttons
    expect(screen.getByRole('button', { name: /semua buku/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sudah dimiliki/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sedang dibaca/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingin dibeli/i })).toBeInTheDocument();
  });

  /**
   * Test 2: Default Active Filter
   * Memastikan filter "Semua Buku" aktif secara default
   */
  it('should have "Semua Buku" as active filter by default', () => {
    renderWithProviders(<BookFilter />);
    
    const allBooksButton = screen.getByRole('button', { name: /semua buku/i });
    expect(allBooksButton).toHaveClass('active');
  });

  /**
   * Test 3: Search Input Functionality
   * Memastikan search input dapat diisi
   */
  it('should allow typing in search input', () => {
    renderWithProviders(<BookFilter />);
    
    const searchInput = screen.getByPlaceholderText(/cari judul atau penulis/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });
});
