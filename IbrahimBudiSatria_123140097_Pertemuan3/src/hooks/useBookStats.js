import { useMemo } from 'react';

/**
 * Custom Hook untuk menghitung statistik buku
 * @param {Array} books - Array dari semua buku
 * @returns {Object} - Objek berisi statistik buku
 */
const useBookStats = (books) => {
  // Menggunakan useMemo untuk menghindari perhitungan ulang yang tidak perlu
  const stats = useMemo(() => {
    const total = books.length;
    
    // Hitung buku berdasarkan status
    const owned = books.filter(book => book.status === 'milik').length;
    const reading = books.filter(book => book.status === 'baca').length;
    const wishlist = books.filter(book => book.status === 'beli').length;
    
    // Hitung persentase
    const ownedPercentage = total > 0 ? ((owned / total) * 100).toFixed(1) : 0;
    const readingPercentage = total > 0 ? ((reading / total) * 100).toFixed(1) : 0;
    const wishlistPercentage = total > 0 ? ((wishlist / total) * 100).toFixed(1) : 0;
    
    // Cari penulis yang paling banyak bukunya
    const authorCount = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonAuthor = Object.keys(authorCount).length > 0
      ? Object.entries(authorCount).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'N/A';
    
    return {
      total,
      owned,
      reading,
      wishlist,
      ownedPercentage,
      readingPercentage,
      wishlistPercentage,
      mostCommonAuthor,
      authorCount
    };
  }, [books]);
  
  return stats;
};

export default useBookStats;
