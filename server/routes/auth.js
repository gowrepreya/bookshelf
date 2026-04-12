const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bookshelf_secret_key_2024';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(400).json({ error: 'Username or email already exists' });

    const user = new User({ username, email, password });
    await user.save();

    // Create default shelves
    const Shelf = require('../models/Shelf');
    await Shelf.create([
      { user: user._id, name: 'Want to Read', isPublic: true },
      { user: user._id, name: 'Currently Reading', isPublic: true },
      { user: user._id, name: 'Read', isPublic: true }
    ]);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, favoriteGenres, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, favoriteGenres, avatar },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
