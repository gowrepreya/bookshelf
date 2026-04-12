import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('bookshelf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bookshelf_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Books
export const getBooks = (params) => API.get('/books', { params });
export const getBook = (id) => API.get(`/books/${id}`);
export const addBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const getGenres = () => API.get('/books/meta/genres');

// Reviews
export const getReviews = (bookId) => API.get(`/reviews/book/${bookId}`);
export const addReview = (data) => API.post('/reviews', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const likeReview = (id) => API.post(`/reviews/${id}/like`);

// Shelves
export const getMyShelves = () => API.get('/shelves/my');
export const createShelf = (data) => API.post('/shelves', data);
export const addBookToShelf = (shelfId, data) => API.post(`/shelves/${shelfId}/books`, data);
export const updateBookOnShelf = (shelfId, bookId, data) => API.put(`/shelves/${shelfId}/books/${bookId}`, data);
export const removeBookFromShelf = (shelfId, bookId) => API.delete(`/shelves/${shelfId}/books/${bookId}`);
export const deleteShelf = (id) => API.delete(`/shelves/${id}`);

export default API;
