import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBooks } from '../api';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const GENRES = [
  { name: 'Fiction', icon: '✨' },
  { name: 'Fantasy', icon: '🐉' },
  { name: 'Science Fiction', icon: '🚀' },
  { name: 'Thriller', icon: '🔪' },
  { name: 'Romance', icon: '💌' },
  { name: 'Non-Fiction', icon: '🔍' },
  { name: 'Self-Help', icon: '🌱' },
  { name: 'Memoir', icon: '📝' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks({ sort: 'rating', limit: 4 })
      .then(res => setFeatured(res.data.books))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Your Personal Reading Universe</div>
          <h1>Every book is a<br /><em>new world.</em></h1>
          <p>Discover, track, and celebrate your reading life. Build shelves, write reviews, and find your next great read.</p>
          <div className="hero-actions">
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
            {!user && <Link to="/register" className="btn btn-outline">Create Free Account</Link>}
            {user && <Link to="/shelf" className="btn btn-outline">My Shelf</Link>}
          </div>
        </div>
      </section>

      <div className="page">
        {/* Stats */}
        {user && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">📚</span>
              <span className="stat-label">Your Library</span>
            </div>
            <div className="stat-card">
              <span className="stat-number" style={{ fontSize: '1.4rem' }}>Welcome back,</span>
              <span className="stat-label">{user.username}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">🌟</span>
              <span className="stat-label">Keep Reading</span>
            </div>
          </div>
        )}

        {/* Genres */}
        <div className="section-header">
          <h2 className="section-title">Browse by Genre</h2>
        </div>
        <div className="genres-grid">
          {GENRES.map(g => (
            <Link key={g.name} to={`/books?genre=${encodeURIComponent(g.name)}`} className="genre-card">
              <span className="genre-icon">{g.icon}</span>
              <span className="genre-name">{g.name}</span>
            </Link>
          ))}
        </div>

        <div className="ornamental-rule"><span>❧</span></div>

        {/* Top Rated */}
        <div className="section-header">
          <h2 className="section-title">Highest Rated</h2>
          <Link to="/books?sort=rating" style={{ color: 'var(--amber)', textDecoration: 'none', fontSize: '0.9rem' }}>
            See all →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-light)', fontStyle: 'italic' }}>
            Loading books…
          </div>
        ) : featured.length > 0 ? (
          <div className="books-grid">
            {featured.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No books yet</h3>
            <p>Be the first to add a book to the library!</p>
            <Link to="/add-book" className="btn btn-primary">Add a Book</Link>
          </div>
        )}
      </div>
    </>
  );
}
