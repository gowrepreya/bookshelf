import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../api';

const GENRES = ['Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Romance', 'Non-Fiction', 'Self-Help', 'Memoir', 'Mystery', 'Horror', 'Biography', 'History', 'Poetry', 'Graphic Novel', 'Other'];

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', genre: '', description: '',
    coverImage: '', publishedYear: '', pages: '', language: 'English',
    publisher: '', isbn: '', tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre) return setError('Title, author and genre are required');
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
        pages: form.pages ? parseInt(form.pages) : undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      const res = await addBook(payload);
      navigate(`/books/${res.data.book._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add book');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-narrow" style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Add a Book</h1>
        <p style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Share a great read with the community</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Book Title *</label>
            <input className="form-input" placeholder="The Great Gatsby" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Author *</label>
            <input className="form-input" placeholder="F. Scott Fitzgerald" value={form.author} onChange={e => set('author', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Genre *</label>
            <select className="form-select" value={form.genre} onChange={e => set('genre', e.target.value)} required>
              <option value="">Select genre…</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={4} placeholder="What is this book about?"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Cover Image URL</label>
            <input className="form-input" placeholder="https://…" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Published Year</label>
            <input type="number" className="form-input" placeholder="2024" min="1000" max={new Date().getFullYear()}
              value={form.publishedYear} onChange={e => set('publishedYear', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pages</label>
            <input type="number" className="form-input" placeholder="320" min="1"
              value={form.pages} onChange={e => set('pages', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Publisher</label>
            <input className="form-input" placeholder="Scribner" value={form.publisher} onChange={e => set('publisher', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <input className="form-input" placeholder="English" value={form.language} onChange={e => set('language', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Tags <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
            <input className="form-input" placeholder="adventure, magic, coming-of-age"
              value={form.tags} onChange={e => set('tags', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding…' : '📚 Add Book'}
          </button>
          <button type="button" className="btn" style={{ background: 'var(--parchment-mid)' }} onClick={() => navigate('/books')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
