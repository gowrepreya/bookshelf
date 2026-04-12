const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/shelves', require('./routes/shelves'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'BookShelf API running' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookshelf';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('📝 Run without DB - starting server anyway for demo...');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (no DB)`));
  });

module.exports = app;
