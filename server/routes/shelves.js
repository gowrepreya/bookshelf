const express = require('express');
const Shelf = require('../models/Shelf');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user shelves
router.get('/my', auth, async (req, res) => {
  try {
    const shelves = await Shelf.find({ user: req.user._id })
      .populate('books.book');
    res.json({ shelves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create shelf
router.post('/', auth, async (req, res) => {
  try {
    const shelf = new Shelf({ ...req.body, user: req.user._id });
    await shelf.save();
    res.status(201).json({ shelf });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add book to shelf
router.post('/:id/books', auth, async (req, res) => {
  try {
    const { bookId, status } = req.body;
    const shelf = await Shelf.findOne({ _id: req.params.id, user: req.user._id });
    if (!shelf) return res.status(404).json({ error: 'Shelf not found' });

    const existingBook = shelf.books.find(b => b.book.toString() === bookId);
    if (existingBook) {
      existingBook.status = status || existingBook.status;
    } else {
      shelf.books.push({ book: bookId, status: status || 'want-to-read' });
    }

    await shelf.save();
    await shelf.populate('books.book');
    res.json({ shelf });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book status on shelf
router.put('/:id/books/:bookId', auth, async (req, res) => {
  try {
    const { status, progress } = req.body;
    const shelf = await Shelf.findOne({ _id: req.params.id, user: req.user._id });
    if (!shelf) return res.status(404).json({ error: 'Shelf not found' });

    const bookEntry = shelf.books.find(b => b.book.toString() === req.params.bookId);
    if (!bookEntry) return res.status(404).json({ error: 'Book not on shelf' });

    if (status) bookEntry.status = status;
    if (progress !== undefined) bookEntry.progress = progress;
    if (status === 'read') bookEntry.finishedAt = new Date();

    await shelf.save();
    res.json({ shelf });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove book from shelf
router.delete('/:id/books/:bookId', auth, async (req, res) => {
  try {
    const shelf = await Shelf.findOne({ _id: req.params.id, user: req.user._id });
    if (!shelf) return res.status(404).json({ error: 'Shelf not found' });
    shelf.books = shelf.books.filter(b => b.book.toString() !== req.params.bookId);
    await shelf.save();
    res.json({ message: 'Book removed from shelf' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete shelf
router.delete('/:id', auth, async (req, res) => {
  try {
    await Shelf.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Shelf deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
