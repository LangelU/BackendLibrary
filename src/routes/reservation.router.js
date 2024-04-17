const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations.controller')
const verifyToken = require('../middleware/auth.middleware');

router
    .get('/', verifyToken, reservationsController.getReservations)
    .get('/details/:id', verifyToken, reservationsController.getReservation)
    .post('/create/:book_id', verifyToken, reservationsController.createReservation)
    .post('/delete/:id', verifyToken, reservationsController.deleteReservation)
    .get('/user/:user_id', verifyToken, reservationsController.getUserReservations)

module.exports = router;