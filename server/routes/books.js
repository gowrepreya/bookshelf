const express = require('express');
const Book = require('../models/Book');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all books with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { genre, search, sort = 'createdAt', page = 1, limit = 12 } = req.query;
    const filter = {};

    if (genre) filter.genre = genre;
    if (search) filter.$text = { $search: search };

    const sortOptions = {
      newest: { createdAt: -1 },
      rating: { averageRating: -1 },
      title: { title: 1 },
      author: { author: 1 }
    };

    const books = await Book.find(filter)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'username');

    const total = await Book.countDocuments(filter);
    res.json({ books, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add book
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({ ...req.body, addedBy: req.user._id });
    await book.save();
    res.status(201).json({ book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', auth, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get genres
router.get('/meta/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json({ genres });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
