const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const mealController = require('../controllers/mealController');


const multer = require('multer');
const path = require('path');
// Set up storage for multer to manage file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // specify the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // add a timestamp to the filename
    }
});

// Configure multer
const upload = multer({ storage: storage });
// Define routes
router.get('/', userController.renderIndexPage);
router.get('/index', userController.renderIndexPage);
router.get('/login', userController.renderLoginPage);
router.post('/login', userController.loginUser);
router.get('/filter', userController.filterMealsByDate);
router.post('/add-meal',upload.single('DescriptionImage'), mealController.addMeal);


module.exports = router;

