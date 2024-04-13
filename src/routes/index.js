const express = require('express');
const booksRouter = require('./book.router');
const authRouter = require('./auth.router');
const userRouter = require('./user.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/books', booksRouter);
    router.use('/auth', authRouter);
    router.use('/users', userRouter);
}

module.exports = routerApi;