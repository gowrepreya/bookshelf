import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook, getReviews, addReview, deleteReview, getMyShelves, addBookToShelf } from '../api';
import { StarDisplay, StarSelector } from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', content: '', spoiler: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([getBook(id), getReviews(id)])
      .then(([bookRes, revRes]) => {
        setBook(bookRes.data.book);
        setReviews(revRes.data.reviews);
      })
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToShelf = async () => {
    if (!user) return navigate('/login');
    const res = await getMyShelves();
    setShelves(res.data.shelves);
    setShowShelfModal(true);
  };

  const handleShelfSelect = async (shelfId, status) => {
    try {
      await addBookToShelf(shelfId, { bookId: book._id, status });
      setShowShelfModal(false);
      setSuccess('Added to shelf!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Could not add to shelf'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return setError('Please select a rating');
    if (!reviewForm.content.trim()) return setError('Please write a review');
    setSubmitting(true); setError('');
    try {
      const res = await addReview({ bookId: id, ...reviewForm });
      setReviews(prev => [res.data.review, ...prev]);
      setReviewForm({ rating: 0, title: '', content: '', spoiler: false });
      setShowReviewForm(false);
      setSuccess('Review posted!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not post review');
    } finally { setSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch { alert('Could not delete review'); }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!book) return null;

  const hasReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="page">
      {success && <div className="alert alert-success">{success}</div>}

      <div className="book-detail-layout">
        {/* Cover */}
        <div>
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="book-detail-cover"
              onError={e => e.target.src = ''} />
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, var(--ink), var(--ink-light))',
              borderRadius: 'var(--radius-lg)', aspectRatio: '2/3',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', gap: '0.5rem', boxShadow: '0 8px 32px var(--shadow-deep)'
            }}>
              <span style={{ fontSize: '3rem' }}>📖</span>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--parchment)', fontWeight: 700, textAlign: 'center' }}>{book.title}</span>
            </div>
          )}
          <div className="book-actions" style={{ marginTop: '1.25rem', flexDirection: 'column' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAddToShelf}>
              + Add to Shelf
            </button>
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="book-detail-genre">{book.genre}</span>
          <h1 className="book-detail-title">{book.title}</h1>
          <div className="book-detail-author">by {book.author}</div>
          <StarDisplay rating={book.averageRating} reviews={book.totalReviews} />

          <div className="book-meta-row">
            {book.publishedYear && <div className="book-meta-item">
              <span className="book-meta-value">{book.publishedYear}</span>
              <span className="book-meta-label">Published</span>
            </div>}
            {book.pages && <div className="book-meta-item">
              <span className="book-meta-value">{book.pages}</span>
              <span className="book-meta-label">Pages</span>
            </div>}
            <div className="book-meta-item">
              <span className="book-meta-value">{book.totalReviews}</span>
              <span className="book-meta-label">Reviews</span>
            </div>
            {book.language && <div className="book-meta-item">
              <span className="book-meta-value">{book.language}</span>
              <span className="book-meta-label">Language</span>
            </div>}
          </div>

          {book.description && <p className="book-description">{book.description}</p>}

          {book.tags?.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              {book.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <div className="ornamental-rule"><span>❧</span></div>
        <div className="section-header">
          <h2 className="section-title">Reviews</h2>
          {user && !hasReviewed && (
            <button className="btn btn-ghost btn-sm" onClick={() => setShowReviewForm(v => !v)}>
              {showReviewForm ? 'Cancel' : '✍️ Write Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Your Review</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div>
              <div className="form-label">Rating</div>
              <StarSelector value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Review Title (optional)</label>
              <input className="form-input" placeholder="A great read…"
                value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Your Thoughts</label>
              <textarea className="form-textarea" rows={5} placeholder="What did you think?"
                value={reviewForm.content} onChange={e => setReviewForm(f => ({ ...f, content: e.target.value }))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={reviewForm.spoiler} onChange={e => setReviewForm(f => ({ ...f, spoiler: e.target.checked }))} />
              <span style={{ fontSize: '0.9rem' }}>Contains spoilers</span>
            </label>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Review'}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <span className="empty-icon">✍️</span>
            <h3>No reviews yet</h3>
            <p>Be the first to review this book!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.user?.username?.[0]?.toUpperCase() || '?'}</div>
                  <div>
                    <div className="reviewer-name">{review.user?.username || 'Anonymous'}</div>
                    <div className="review-date">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StarDisplay rating={review.rating} />
                  {user && review.user?._id === user._id && (
                    <button onClick={() => handleDeleteReview(review._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rust)', fontSize: '0.8rem' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {review.spoiler && (
                <div style={{ background: 'var(--amber-pale)', border: '1px solid rgba(200,134,10,0.3)', borderRadius: 'var(--radius)', padding: '0.4rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--amber)' }}>
                  ⚠️ Spoiler warning
                </div>
              )}
              {review.title && <div className="review-title">{review.title}</div>}
              <p className="review-content">{review.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add to Shelf Modal */}
      {showShelfModal && (
        <div className="modal-overlay" onClick={() => setShowShelfModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add to Shelf</h3>
            {shelves.length === 0 ? (
              <p>No shelves found. Create a shelf first.</p>
            ) : (
              shelves.map(shelf => (
                <div key={shelf._id} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.4rem' }}>{shelf.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['want-to-read', 'reading', 'read'].map(status => (
                      <button key={status} className="btn btn-ghost btn-sm" onClick={() => handleShelfSelect(shelf._id, status)}>
                        {status === 'want-to-read' ? 'Want to Read' : status === 'reading' ? 'Reading' : 'Read'}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
            <div className="modal-actions">
              <button className="btn btn-sm" style={{ background: 'var(--parchment-mid)' }} onClick={() => setShowShelfModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
