import { useState, useEffect } from 'react';

/**
 * Custom Hook untuk mengelola state yang disimpan di localStorage
 * @param {string} key - Key untuk localStorage
 * @param {any} initialValue - Nilai default jika tidak ada data di localStorage
 * @returns {Array} - [storedValue, setValue] seperti useState
 */
const useLocalStorage = (key, initialValue) => {
  // State untuk menyimpan nilai
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Ambil data dari localStorage
      const item = window.localStorage.getItem(key);
      // Parse data atau return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // useEffect untuk menyimpan ke localStorage setiap kali nilai berubah
  useEffect(() => {
    try {
      // Simpan ke localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
