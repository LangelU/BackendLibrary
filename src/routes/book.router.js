const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const verifyToken = require('../middleware/auth.middleware');

router
    .get('/', booksController.getBooks)
    .get('/details/:id', booksController.getBook)
    .post('/create', verifyToken, booksController.createBook)
    .post('/update/:id', verifyToken, booksController.updateBook)
    .post('/delete/:id', verifyToken, booksController.deleteBook)

module.exports = router;
