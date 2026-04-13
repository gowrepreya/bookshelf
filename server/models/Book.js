const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, default: undefined },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  genre: { type: String, required: true },
  publishedYear: { type: Number },
  publisher: { type: String, default: '' },
  pages: { type: Number },
  language: { type: String, default: 'English' },
  tags: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
