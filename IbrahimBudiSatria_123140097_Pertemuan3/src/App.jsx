import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import './App.css';

/**
 * Komponen Navigation
 * Menampilkan navigation bar dengan active state
 */
const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon"></span>
          <span className="brand-text">PAW RA</span>
        </div>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              🏠 Beranda
            </Link>
          </li>
          <li>
            <Link
              to="/stats"
              className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
            >
              📊 Statistik
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

/**
 * Komponen App utama
 * Mengatur routing dan provide context ke seluruh aplikasi
 */
function App() {
  return (
    <Router>
      <BookProvider>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>Aplikasi Manajemen Buku Pribadi</p>
            <p>Dibuat oleh Ibrahim Budi Satria (123140097)</p>
          </footer>
        </div>
      </BookProvider>
    </Router>
  );
}

export default App;
