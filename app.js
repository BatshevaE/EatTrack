process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');

const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const mealController = require('./controllers/mealController');
require('dotenv').config(); // Load environment variables

const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes for user-related actions
app.use('/', userRoutes);

  

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

