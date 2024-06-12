const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Middleware to parse URL-encoded form data
public_users.use(express.urlencoded({ extended: true }));

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  console.log(username);
  const password = req.body.password;
  console.log(password);
  if (username && password) {
    const user = users.find(user => user.username === username);
    if (!user) {
      users.push({ username: username, password: password });
      res.send(`User with username ${username} successfully added!`);
    } else {
      return res.status(400).json({ message: `User with username ${username} already exists!` });
    }
  } else {
    return res.status(400).json({ message: "Please provide both username and password!" });
  }
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   if (books) {
//     res.send(JSON.stringify(books, null, 4));
//   } else {
//     return res.status(404).json({ message: "Books not found!" });
//   }
// });
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Books not found!"));
    }
  }).then(books => {
    res.send(JSON.stringify(books, null, 4));
  }).catch(error => {
    res.status(404).json({ message: error.message });
  });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     res.send(books[isbn]);
//   } else {
//     return res.status(404).json({ message: `Book with ISBN ${isbn} not found!` });
//   }
// });
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books);
    } else {
      reject(new Error(`Book with ISBN ${isbn} not found!`));
    }
  }).then(books => {
    res.send(books[isbn]);
  }).catch(error => {
    res.status(404).json({ message: error.message });
  })
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   if (author) {
//     const book = Object.values(books).find(b => b.author.toLowerCase() === author.toLowerCase());
//     if (book) {
//       res.json(book);
//     } else {
//       res.status(404).send(`Book with author ${author} not found!`);
//     }
//   } else {
//     return res.status(400).send('Author query parameter is required');
//   }
// });
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const book = Object.values(books).find(b => b.author.toLowerCase() === author.toLowerCase());
  new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error(`Book with author ${author} not found!`));
    }
  }).then(book => {
    res.send(book);
  }).catch(error => {
    res.status(404).json({ message: error.message });
  })
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   if (title) {
//     const book = Object.values(books).find(b => b.title.toLowerCase() === title.toLowerCase());
//     if (book) {
//       res.json(book);
//     } else {
//       res.status(404).send(`Book with title ${title} not found!`);
//     }
//   } else {
//     return res.status(400).send('Title query parameter is required');
//   }
// });
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).find(b => b.title.toLowerCase() === title.toLowerCase());
  new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error(`Book with title ${title} not found!`));
    }
  }).then(book => {
    res.send(book);
  }).catch(error => {
    res.status(404).json({ message: error.message });
  })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found!` });
  }
});

module.exports.general = public_users;
