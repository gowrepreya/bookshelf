const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a book
router.get('/book/:bookId', optionalAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, rating, title, content, spoiler } = req.body;
    const review = new Review({
      book: bookId,
      user: req.user._id,
      rating, title, content, spoiler
    });
    await review.save();

    // Update book average rating
    const reviews = await Review.find({ book: bookId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    await review.populate('user', 'username avatar');
    res.status(201).json({ review });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ error: 'You already reviewed this book' });
    res.status(400).json({ error: error.message });
  }
});

// Update review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'username avatar');

    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const reviews = await Review.find({ book: review.book });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Book.findByIdAndUpdate(review.book, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a review
router.post('/:id/like', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const liked = review.likes.includes(req.user._id);
    if (liked) {
      review.likes.pull(req.user._id);
    } else {
      review.likes.push(req.user._id);
    }
    await review.save();
    res.json({ liked: !liked, likesCount: review.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
