const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const authenticateJWT = require('./auth_middleware.js');
const regd_users = express.Router();

let users = [];

const SECRET_KEY = 'access';

// Middleware to parse URL-encoded form data
regd_users.use(express.urlencoded({ extended: true }));

const isValid = (username) => { //returns boolean
  // Simple check for valid username (you can expand this logic)
  return typeof username === 'string' && username.trim() !== '';
}

const authenticatedUser = (username, password) => { //returns boolean
  // Check if username and password match any user in the users array
  const user = users.find(u => u.username === username && u.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found!` });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review query parameter is required' });
  }

  const book = books[isbn];
  book.reviews = book.reviews || {};

  book.reviews.user = username;
  book.reviews.description = review;

  res.json({ message: `Review for book with ISBN ${isbn} added/updated successfully!` });
});

regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  const book = Object.values(books).find(b => b.reviews.user === username);
  if (book) {
    book.reviews = {};
    res.json(`Review of book with ISBN ${isbn} by user with username ${username} successfully deleted!`);
  } else {
    res.status(404).json({ message: `Review for book with ISBN ${isbn} by user with username ${username} not found!` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
