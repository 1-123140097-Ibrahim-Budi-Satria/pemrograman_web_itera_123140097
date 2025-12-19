import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Test Suite untuk useLocalStorage Custom Hook
 * Menguji fungsionalitas localStorage hook
 */
describe('useLocalStorage Hook', () => {
  /**
   * Test 1: Initialize with Default Value
   * Memastikan hook mengembalikan nilai default saat pertama kali
   */
  it('should initialize with default value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', 'defaultValue')
    );
    
    expect(result.current[0]).toBe('defaultValue');
  });

  /**
   * Test 2: Update Value
   * Memastikan hook dapat mengupdate nilai
   */
  it('should update stored value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey2', 'initial')
    );
    
    // Ambil setter function
    const setValue = result.current[1];
    
    // Update value
    setValue('updated');
    
    // Cek nilai baru
    expect(result.current[0]).toBe('updated');
  });

  /**
   * Test 3: Handle Array Values
   * Memastikan hook dapat menangani array
   */
  it('should handle array values', () => {
    const initialArray = [{ id: 1, name: 'Test' }];
    const { result } = renderHook(() => 
      useLocalStorage('testArray', initialArray)
    );
    
    expect(Array.isArray(result.current[0])).toBe(true);
    expect(result.current[0]).toEqual(initialArray);
  });
});
