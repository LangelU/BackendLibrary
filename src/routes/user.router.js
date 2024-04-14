const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middleware/auth.middleware');
router
    .post('/signup', usersController.register)
    .get('/', verifyToken, usersController.getUsers)
    .get('/details/:id', verifyToken, usersController.getUser)
    .post('/update/:id', verifyToken, usersController.updateUser)
    .post('/delete/:id', verifyToken, usersController.deleteUser)
module.exports = router;