import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookProvider, useBooks } from '../context/BookContext';

/**
 * Test Component untuk testing Context
 */
const TestComponent = () => {
  const { books, addBook } = useBooks();
  
  return (
    <div>
      <div data-testid="book-count">{books.length}</div>
      <button onClick={() => addBook({ 
        title: 'Test Book', 
        author: 'Test Author', 
        status: 'milik' 
      })}>
        Add Book
      </button>
    </div>
  );
};

/**
 * Test Suite untuk BookContext
 * Menguji Context API dan state management
 */
describe('BookContext', () => {
  /**
   * Test 1: Context Provider Works
   * Memastikan Context Provider berfungsi
   */
  it('should provide books context', () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );
    
    expect(screen.getByTestId('book-count')).toBeInTheDocument();
  });

  /**
   * Test 2: Initial State
   * Memastikan state awal benar
   */
  it('should have initial empty books array', () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );
    
    const bookCount = screen.getByTestId('book-count');
    expect(bookCount.textContent).toBe('0');
  });
});
