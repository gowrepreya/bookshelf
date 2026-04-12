# 📚 BookShelf — MERN Stack App for Book Lovers

A full-stack web application for book enthusiasts to discover, track, and review books. Built with **MongoDB, Express, React, and Node.js**.

---

## ✨ Features

### 📖 Books
- Browse all books with search, genre filter, and sort options
- Book detail page with cover, metadata, and description
- Add new books to the community library
- Genre-based exploration

### ⭐ Reviews & Ratings
- Write reviews with 1–5 star ratings
- Spoiler warnings on reviews
- Average rating calculated automatically
- Delete your own reviews

### 📂 Personal Shelves
- Three default shelves: **Want to Read**, **Currently Reading**, **Read**
- Create custom shelves
- Update reading status per book
- At-a-glance reading stats

### 👤 User Accounts
- Register and login with JWT authentication
- Profile page with bio and favorite genres
- All data scoped to your account

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Styling | Custom CSS (no framework) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ — [Download](https://nodejs.org)
- **MongoDB** — [Local](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- **npm** v8+

### 1. Clone & Install

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookshelf
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

For **MongoDB Atlas**, replace MONGO_URI with your connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookshelf
```

### 3. Seed Sample Books (optional)

```bash
npm run seed
```
This adds 8 curated books to get you started.

### 4. Run the App

```bash
# Run both server and client simultaneously
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
bookshelf/
├── package.json              # Root scripts (concurrently)
│
├── server/                   # Express API
│   ├── index.js              # Entry point
│   ├── .env.example          # Environment template
│   ├── seed.js               # Sample data seeder
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Book.js           # Book schema
│   │   ├── Review.js         # Review schema
│   │   └── Shelf.js          # Reading shelf schema
│   ├── routes/
│   │   ├── auth.js           # Register, login, profile
│   │   ├── books.js          # CRUD + search + filter
│   │   ├── reviews.js        # Reviews + likes
│   │   └── shelves.js        # Shelf management
│   └── middleware/
│       └── auth.js           # JWT middleware
│
└── client/                   # React frontend
    ├── public/index.html
    └── src/
        ├── App.js            # Routes
        ├── index.css         # Global styles
        ├── api.js            # Axios API calls
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── BookCard.js
        │   └── StarRating.js
        └── pages/
            ├── Home.js
            ├── Books.js
            ├── BookDetail.js
            ├── Login.js
            ├── Register.js
            ├── MyShelf.js
            ├── AddBook.js
            └── Profile.js
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| PUT | `/api/auth/profile` | Update profile |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List books (filter/search/page) |
| GET | `/api/books/:id` | Single book |
| POST | `/api/books` | Add book (auth) |
| PUT | `/api/books/:id` | Update book (auth) |
| DELETE | `/api/books/:id` | Delete book (auth) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/book/:bookId` | Book reviews |
| POST | `/api/reviews` | Add review (auth) |
| PUT | `/api/reviews/:id` | Update review (auth) |
| DELETE | `/api/reviews/:id` | Delete review (auth) |
| POST | `/api/reviews/:id/like` | Like/unlike (auth) |

### Shelves
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shelves/my` | My shelves (auth) |
| POST | `/api/shelves` | Create shelf (auth) |
| POST | `/api/shelves/:id/books` | Add book to shelf (auth) |
| PUT | `/api/shelves/:id/books/:bookId` | Update status (auth) |
| DELETE | `/api/shelves/:id/books/:bookId` | Remove book (auth) |

---

## 🔮 Ideas to Extend

- **Reading challenges** — set annual reading goals
- **Book clubs** — group shelves and discussions
- **Social features** — follow readers, see their shelves
- **Recommendations** — AI-powered "Read Next" suggestions
- **Import from Goodreads** — CSV import of your reading history
- **Mobile app** — React Native version
- **Dark mode** — toggle between themes

---

## 📜 License

MIT — free to use and modify for personal projects.

---

*Built with ❤️ for readers everywhere.*
