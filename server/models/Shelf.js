const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    status: { type: String, enum: ['want-to-read', 'reading', 'read'], default: 'want-to-read' },
    progress: { type: Number, default: 0 }, // pages read
    addedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shelf', shelfSchema);
