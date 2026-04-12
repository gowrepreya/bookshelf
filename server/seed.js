const mongoose = require('mongoose');
const Book = require('./models/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookshelf';

const sampleBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    publishedYear: 2020,
    pages: 304,
    averageRating: 4.2,
    totalReviews: 1289,
    coverImage: 'https://covers.openlibrary.org/b/id/10519563-L.jpg',
    tags: ['fantasy', 'philosophy', 'mental health']
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones. Transform your life with tiny changes.',
    publishedYear: 2018,
    pages: 320,
    averageRating: 4.8,
    totalReviews: 3541,
    coverImage: 'https://covers.openlibrary.org/b/id/10519503-L.jpg',
    tags: ['productivity', 'habits', 'psychology']
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'A lone astronaut must save the earth from disaster in this propulsive, wonderful new science-based thriller.',
    publishedYear: 2021,
    pages: 476,
    averageRating: 4.9,
    totalReviews: 2871,
    coverImage: 'https://covers.openlibrary.org/b/id/12408048-L.jpg',
    tags: ['space', 'adventure', 'science']
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    publishedYear: 2018,
    pages: 334,
    averageRating: 4.7,
    totalReviews: 2156,
    coverImage: 'https://covers.openlibrary.org/b/id/8750703-L.jpg',
    tags: ['memoir', 'education', 'family']
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    description: 'The riveting first-person narrative of a young man who grows to be one of the most notorious magicians his world has ever seen.',
    publishedYear: 2007,
    pages: 662,
    averageRating: 4.5,
    totalReviews: 4203,
    coverImage: 'https://covers.openlibrary.org/b/id/6388830-L.jpg',
    tags: ['epic fantasy', 'magic', 'adventure']
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    description: 'A brief history of humankind, exploring how Homo sapiens came to dominate the Earth.',
    publishedYear: 2011,
    pages: 443,
    averageRating: 4.4,
    totalReviews: 3892,
    coverImage: 'https://covers.openlibrary.org/b/id/9252896-L.jpg',
    tags: ['history', 'anthropology', 'evolution']
  },
  {
    title: 'Normal People',
    author: 'Sally Rooney',
    genre: 'Romance',
    description: 'A story of mutual fascination, friendship and love between two people from Sligo, Ireland.',
    publishedYear: 2018,
    pages: 266,
    averageRating: 3.9,
    totalReviews: 1876,
    coverImage: 'https://covers.openlibrary.org/b/id/9262330-L.jpg',
    tags: ['contemporary', 'romance', 'coming-of-age']
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    description: "A famous painter's sudden act of violence against her husband, and her refusal to speak about it afterward.",
    publishedYear: 2019,
    pages: 325,
    averageRating: 4.1,
    totalReviews: 2341,
    coverImage: 'https://covers.openlibrary.org/b/id/9278420-L.jpg',
    tags: ['psychological thriller', 'mystery', 'suspense']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log(`✅ Seeded ${sampleBooks.length} books`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
