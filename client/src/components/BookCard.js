import React from 'react';
import { Link } from 'react-router-dom';
import { StarDisplay } from './StarRating';

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      {book.coverImage ? (
        <img src={book.coverImage} alt={book.title} className="book-cover"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
      ) : null}
      <div className="book-cover-placeholder" style={{ display: book.coverImage ? 'none' : 'flex' }}>
        <span className="ph-icon">📖</span>
        <span className="ph-title">{book.title}</span>
        <span className="ph-author">{book.author}</span>
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <div className="author">{book.author}</div>
        <span className="genre-badge">{book.genre}</span>
        {book.averageRating > 0 && (
          <StarDisplay rating={book.averageRating} reviews={book.totalReviews} />
        )}
      </div>
    </Link>
  );
}
