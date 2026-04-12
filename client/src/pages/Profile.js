import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api';

const ALL_GENRES = ['Fiction', 'Fantasy', 'Science Fiction', 'Thriller', 'Romance', 'Non-Fiction', 'Self-Help', 'Memoir', 'Mystery', 'Horror', 'Biography', 'Poetry'];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    bio: user?.bio || '',
    favoriteGenres: user?.favoriteGenres || [],
    avatar: user?.avatar || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const toggleGenre = (genre) => {
    setForm(f => ({
      ...f,
      favoriteGenres: f.favoriteGenres.includes(genre)
        ? f.favoriteGenres.filter(g => g !== genre)
        : [...f.favoriteGenres, genre]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await updateProfile(form);
      setUser(res.data.user);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Could not update profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page-narrow" style={{ maxWidth: 600, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="avatar-circle" style={{ width: 72, height: 72, fontSize: '1.8rem', margin: '0 auto 1rem' }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900 }}>{user?.username}</h1>
        <p style={{ color: 'var(--ink-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>{user?.email}</p>
        <p style={{ color: 'var(--ink-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-textarea" rows={3} placeholder="Tell us about yourself as a reader…"
            value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={300} />
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-light)', textAlign: 'right' }}>{form.bio.length}/300</div>
        </div>

        <div className="form-group">
          <label className="form-label">Favorite Genres</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {ALL_GENRES.map(genre => (
              <button key={genre} type="button"
                onClick={() => toggleGenre(genre)}
                style={{
                  padding: '0.3rem 0.9rem',
                  borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                  fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                  background: form.favoriteGenres.includes(genre) ? 'var(--amber)' : 'var(--parchment-mid)',
                  color: form.favoriteGenres.includes(genre) ? 'var(--ink)' : 'var(--ink-light)',
                  border: form.favoriteGenres.includes(genre) ? '1px solid var(--amber)' : '1px solid var(--parchment-mid)'
                }}>
                {genre}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
