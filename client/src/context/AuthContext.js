import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bookshelf_token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('bookshelf_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('bookshelf_token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('bookshelf_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
