import React from 'react';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import './Home.css';

/**
 * Halaman Home - Halaman utama aplikasi
 * Menampilkan form, filter, dan list buku
 */
const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Manajemen Buku Pribadi</h1>
        <p>Kelola koleksi</p>
      </div>

      <div className="content-section">
        {/* Form untuk menambah buku */}
        <section className="add-book-section">
          <BookForm />
        </section>

        {/* Filter dan Search */}
        <section className="filter-section">
          <BookFilter />
        </section>

        {/* List buku */}
        <section className="book-list-section">
          <h2>Daftar Buku</h2>
          <BookList />
        </section>
      </div>
    </div>
  );
};

export default Home;
