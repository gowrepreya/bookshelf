import React from 'react';

export function StarDisplay({ rating, reviews }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
      {rating > 0 && <span className="rating-text">{rating.toFixed(1)}{reviews !== undefined && ` (${reviews})`}</span>}
    </div>
  );
}

export function StarSelector({ value, onChange }) {
  const [hover, setHover] = React.useState(0);
  return (
    <div className="star-selector">
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          className={`star-btn ${n <= (hover || value) ? 'active' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
      {value > 0 && <span style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginLeft: '0.5rem', fontStyle: 'italic' }}>
        {['','Poor','Fair','Good','Great','Amazing'][value]}
      </span>}
    </div>
  );
}
