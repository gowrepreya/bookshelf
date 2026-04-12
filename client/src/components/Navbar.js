import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="book-icon">📚</span> BookShelf
        </Link>
        <ul className="navbar-links">
          <li><NavLink to="/books">Browse</NavLink></li>
          {user && (
            <>
              <li><NavLink to="/shelf">My Shelf</NavLink></li>
              <li><NavLink to="/add-book">+ Add Book</NavLink></li>
            </>
          )}
          {user ? (
            <>
              <li>
                <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="avatar-circle">{user.username[0].toUpperCase()}</span>
                  <span style={{ color: 'rgba(250,245,235,0.8)', fontSize: '0.88rem' }}>{user.username}</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-sm" style={{
                  background: 'transparent', border: '1px solid rgba(250,245,235,0.2)',
                  color: 'rgba(250,245,235,0.6)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius)',
                  transition: 'all 0.2s'
                }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register" className="btn-nav">Join Free</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
