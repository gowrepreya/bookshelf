const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 100 },
  content: { type: String, required: true, minlength: 10, maxlength: 2000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  spoiler: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
