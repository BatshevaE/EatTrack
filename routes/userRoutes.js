const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const mealController = require('../controllers/mealController');

// Define routes
router.get('/', userController.renderIndexPage);
router.get('/index', userController.renderIndexPage);
router.get('/login', userController.renderLoginPage);
router.post('/login', userController.loginUser);
router.get('/filter', userController.filterMealsByDate);
router.post('/add-meal', mealController.addMeal);


module.exports = router;

