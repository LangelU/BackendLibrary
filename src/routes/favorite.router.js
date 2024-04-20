const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller')
const verifyToken = require('../middleware/auth.middleware');

router
    .post('/create/:book_id', verifyToken, favoritesController.createFavorite)
    .post('/delete/:id', verifyToken, favoritesController.deleteFavorite)
    .get('/user/:user_id', verifyToken, favoritesController.getUserFavorites)

module.exports = router;