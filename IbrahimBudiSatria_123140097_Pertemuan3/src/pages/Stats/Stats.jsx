import React from 'react';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Halaman Stats - Menampilkan statistik buku
 * Menggunakan custom hook useBookStats
 */
const Stats = () => {
  const { books } = useBooks();
  const stats = useBookStats(books);

  /**
   * Komponen Card untuk menampilkan statistik
   */
  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  /**
   * Komponen Progress Bar
   */
  const ProgressBar = ({ label, percentage, color }) => (
    <div className="progress-item">
      <div className="progress-label">
        <span>{label}</span>
        <span className="progress-value">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="stats-page">
      <div className="hero-section">
        <h1>Statistik</h1>
        <p>Lihat ringkasan koleksi buku </p>
      </div>

      <div className="stats-content">
        {/* Overview Cards */}
        <section className="stats-overview">
          <StatCard
            icon="📚"
            title="Total Buku"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon="✅"
            title="Sudah Dimiliki"
            value={stats.owned}
            subtitle={`${stats.ownedPercentage}% dari total`}
            color="green"
          />
          <StatCard
            icon="📖"
            title="Sedang Dibaca"
            value={stats.reading}
            subtitle={`${stats.readingPercentage}% dari total`}
            color="orange"
          />
          <StatCard
            icon="🛒"
            title="Ingin Dibeli"
            value={stats.wishlist}
            subtitle={`${stats.wishlistPercentage}% dari total`}
            color="red"
          />
        </section>

        {/* Distribution Chart */}
        <section className="stats-section">
          <h2>Distribusi Status Buku</h2>
          <div className="progress-container">
            <ProgressBar
              label="Sudah Dimiliki"
              percentage={stats.ownedPercentage}
              color="green"
            />
            <ProgressBar
              label="Sedang Dibaca"
              percentage={stats.readingPercentage}
              color="orange"
            />
            <ProgressBar
              label="Ingin Dibeli"
              percentage={stats.wishlistPercentage}
              color="red"
            />
          </div>
        </section>

        {/* Author Info */}
        <section className="stats-section">
          <h2>Penulis Terfavorit</h2>
          <div className="author-info">
            <div className="author-card">
              <span className="author-icon">✍️</span>
              <div>
                <h3>{stats.mostCommonAuthor}</h3>
                <p>
                  {stats.mostCommonAuthor !== 'N/A' 
                    ? `${stats.authorCount[stats.mostCommonAuthor]} buku`
                    : 'Belum ada data'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        {stats.total > 0 && (
          <section className="stats-section">
            <h2>Ringkasan Koleksi</h2>
            <div className="summary-card">
              <p>
                Anda memiliki <strong>{stats.total} buku</strong> dalam koleksi Anda.
              </p>
              <p>
                <strong>{stats.owned} buku</strong> sudah dimiliki,{' '}
                <strong>{stats.reading} buku</strong> sedang dibaca, dan{' '}
                <strong>{stats.wishlist} buku</strong> dalam wishlist.
              </p>
              <p>
                Penulis favorit Anda adalah <strong>{stats.mostCommonAuthor}</strong>.
              </p>
            </div>
          </section>
        )}

        {/* Empty State */}
        {stats.total === 0 && (
          <section className="empty-stats">
            <div className="empty-icon">📚</div>
            <h3>Belum ada data statistik</h3>
            <p>Tambahkan buku pertama Anda untuk melihat statistik</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Stats;
