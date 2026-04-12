import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks } from '../api';
import BookCard from '../components/BookCard';

const GENRES = ['All', 'Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Romance', 'Non-Fiction', 'Self-Help', 'Memoir', 'Mystery', 'Horror', 'Biography'];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchBooks = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (genre && genre !== 'All') params.genre = genre;
    if (search) params.search = search;
    getBooks(params)
      .then(res => {
        setBooks(res.data.books);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [genre, sort, search, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const setPage = (n) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', n);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Book Library</h1>
        <span className="section-count">{total} books</span>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-search">
          <span className="search-icon">🔍</span>
          <input
            type="text" placeholder="Search books, authors…"
            className="form-input"
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
        </div>
        <select className="form-select filter-select" value={genre || 'All'} onChange={e => setParam('genre', e.target.value === 'All' ? '' : e.target.value)}>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="form-select filter-select" value={sort} onChange={e => setParam('sort', e.target.value)}>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="title">A–Z Title</option>
          <option value="author">A–Z Author</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '2rem' }}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{ background: 'var(--cream)', borderRadius: 'var(--radius-lg)', height: 360, opacity: 0.5, animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔭</span>
          <h3>No books found</h3>
          <p>Try changing your filters or search term</p>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map(book => <BookCard key={book._id} book={book} />)}
          </div>
          {pages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(page - 1)} disabled={page <= 1}>‹</button>
              {Array.from({length: pages}, (_, i) => i + 1)
                .filter(n => n === 1 || n === pages || Math.abs(n - page) <= 2)
                .map(n => (
                  <button key={n} className={`page-btn ${n === page ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                ))}
              <button className="page-btn" onClick={() => setPage(page + 1)} disabled={page >= pages}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
