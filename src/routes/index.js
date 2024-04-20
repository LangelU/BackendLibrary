const express = require('express');
const booksRouter = require('./book.router');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');
const reservationRouter = require('./reservation.router');
const favoriteRouter = require('./favorite.router')

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/books', booksRouter);
    router.use('/auth', authRouter);
    router.use('/users', userRouter);
    router.use('/reservations', reservationRouter)
    router.use('/favorites', favoriteRouter)
}

module.exports = routerApi;