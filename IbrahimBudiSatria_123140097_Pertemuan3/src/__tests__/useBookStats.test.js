import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBookStats from '../hooks/useBookStats';

/**
 * Test Suite untuk useBookStats Custom Hook
 * Menguji perhitungan statistik buku
 */
describe('useBookStats Hook', () => {
  /**
   * Test 1: Empty Books Array
   * Memastikan hook mengembalikan statistik kosong
   */
  it('should return zero stats for empty books array', () => {
    const { result } = renderHook(() => useBookStats([]));
    
    expect(result.current.total).toBe(0);
    expect(result.current.owned).toBe(0);
    expect(result.current.reading).toBe(0);
    expect(result.current.wishlist).toBe(0);
  });

  /**
   * Test 2: Calculate Stats Correctly
   * Memastikan perhitungan statistik benar
   */
  it('should calculate stats correctly', () => {
    const books = [
      { id: '1', title: 'Book 1', author: 'Author A', status: 'milik' },
      { id: '2', title: 'Book 2', author: 'Author B', status: 'baca' },
      { id: '3', title: 'Book 3', author: 'Author A', status: 'milik' },
      { id: '4', title: 'Book 4', author: 'Author C', status: 'beli' },
    ];
    
    const { result } = renderHook(() => useBookStats(books));
    
    expect(result.current.total).toBe(4);
    expect(result.current.owned).toBe(2);
    expect(result.current.reading).toBe(1);
    expect(result.current.wishlist).toBe(1);
  });

  /**
   * Test 3: Calculate Percentages
   * Memastikan perhitungan persentase benar
   */
  it('should calculate percentages correctly', () => {
    const books = [
      { id: '1', title: 'Book 1', author: 'Author A', status: 'milik' },
      { id: '2', title: 'Book 2', author: 'Author B', status: 'milik' },
    ];
    
    const { result } = renderHook(() => useBookStats(books));
    
    expect(result.current.ownedPercentage).toBe('100.0');
    expect(result.current.readingPercentage).toBe('0.0');
  });

  /**
   * Test 4: Most Common Author
   * Memastikan penentuan penulis terfavorit benar
   */
  it('should identify most common author', () => {
    const books = [
      { id: '1', title: 'Book 1', author: 'Author A', status: 'milik' },
      { id: '2', title: 'Book 2', author: 'Author A', status: 'baca' },
      { id: '3', title: 'Book 3', author: 'Author B', status: 'milik' },
    ];
    
    const { result } = renderHook(() => useBookStats(books));
    
    expect(result.current.mostCommonAuthor).toBe('Author A');
    expect(result.current.authorCount['Author A']).toBe(2);
  });
});
