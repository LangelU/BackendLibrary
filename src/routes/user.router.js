const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middleware/auth.middleware');
router
    .get('/', verifyToken, usersController.getUsers)
    .post('/signup', usersController.register)
    .post('/update', verifyToken, usersController.updateUser)
module.exports = router;