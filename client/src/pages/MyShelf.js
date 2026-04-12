import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyShelves, removeBookFromShelf, updateBookOnShelf, createShelf } from '../api';

const STATUS_LABELS = { 'want-to-read': 'Want to Read', 'reading': 'Reading', 'read': 'Read' };
const STATUS_CLASS = { 'want-to-read': 'status-want', 'reading': 'status-reading', 'read': 'status-read' };

export default function MyShelf() {
  const [shelves, setShelves] = useState([]);
  const [activeShelf, setActiveShelf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newShelfName, setNewShelfName] = useState('');
  const [showNewShelf, setShowNewShelf] = useState(false);

  useEffect(() => {
    getMyShelves()
      .then(res => {
        setShelves(res.data.shelves);
        if (res.data.shelves.length > 0) setActiveShelf(res.data.shelves[0]._id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (shelfId, bookId) => {
    if (!window.confirm('Remove from shelf?')) return;
    await removeBookFromShelf(shelfId, bookId);
    setShelves(prev => prev.map(s => s._id === shelfId
      ? { ...s, books: s.books.filter(b => b.book?._id !== bookId) }
      : s
    ));
  };

  const handleStatusChange = async (shelfId, bookId, status) => {
    await updateBookOnShelf(shelfId, bookId, { status });
    setShelves(prev => prev.map(s => s._id === shelfId
      ? { ...s, books: s.books.map(b => b.book?._id === bookId ? { ...b, status } : b) }
      : s
    ));
  };

  const handleCreateShelf = async () => {
    if (!newShelfName.trim()) return;
    const res = await createShelf({ name: newShelfName });
    setShelves(prev => [...prev, res.data.shelf]);
    setActiveShelf(res.data.shelf._id);
    setNewShelfName(''); setShowNewShelf(false);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const currentShelf = shelves.find(s => s._id === activeShelf);
  const totalBooks = shelves.reduce((acc, s) => acc + s.books.length, 0);
  const readBooks = shelves.reduce((acc, s) => acc + s.books.filter(b => b.status === 'read').length, 0);
  const readingBooks = shelves.reduce((acc, s) => acc + s.books.filter(b => b.status === 'reading').length, 0);

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">My Shelf</h1>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowNewShelf(v => !v)}>+ New Shelf</button>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-number">{totalBooks}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{readBooks}</span>
          <span className="stat-label">Read</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{readingBooks}</span>
          <span className="stat-label">Reading Now</span>
        </div>
      </div>

      {showNewShelf && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <input className="form-input" placeholder="Shelf name…" value={newShelfName}
            onChange={e => setNewShelfName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateShelf()}
            style={{ maxWidth: 280 }} />
          <button className="btn btn-primary btn-sm" onClick={handleCreateShelf}>Create</button>
          <button className="btn btn-sm" style={{ background: 'var(--parchment-mid)' }} onClick={() => setShowNewShelf(false)}>Cancel</button>
        </div>
      )}

      {shelves.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <h3>Your shelf is empty</h3>
          <p>Browse books and add them to your shelf!</p>
          <Link to="/books" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <>
          <div className="shelf-tabs">
            {shelves.map(shelf => (
              <button key={shelf._id}
                className={`shelf-tab ${activeShelf === shelf._id ? 'active' : ''}`}
                onClick={() => setActiveShelf(shelf._id)}>
                {shelf.name} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({shelf.books.length})</span>
              </button>
            ))}
          </div>

          {currentShelf && (
            currentShelf.books.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <span className="empty-icon">📭</span>
                <h3>This shelf is empty</h3>
                <p>Browse books and add them here!</p>
                <Link to="/books" className="btn btn-ghost btn-sm">Browse Books</Link>
              </div>
            ) : (
              <div>
                {currentShelf.books.map(entry => {
                  const book = entry.book;
                  if (!book) return null;
                  return (
                    <div key={book._id} className="shelf-book-row">
                      <Link to={`/books/${book._id}`}>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="shelf-book-thumb" />
                        ) : (
                          <div className="shelf-book-thumb" style={{ background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📖</div>
                        )}
                      </Link>
                      <div className="shelf-book-info">
                        <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="shelf-book-title">{book.title}</div>
                        </Link>
                        <div className="shelf-book-author">{book.author}</div>
                      </div>
                      <select
                        className="form-select" style={{ width: 'auto', fontSize: '0.82rem', padding: '0.3rem 0.6rem' }}
                        value={entry.status}
                        onChange={e => handleStatusChange(currentShelf._id, book._id, e.target.value)}>
                        <option value="want-to-read">Want to Read</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read ✓</option>
                      </select>
                      <span className={`status-badge ${STATUS_CLASS[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
                      <button onClick={() => handleRemove(currentShelf._id, book._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rust)', fontSize: '1.1rem' }}
                        title="Remove">×</button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
