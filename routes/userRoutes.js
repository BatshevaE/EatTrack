const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/', userController.renderIndexPage);
router.get('/index', userController.renderIndexPage);
router.get('/login', userController.renderLoginPage);
router.post('/login', userController.loginUser);

module.exports = router;
