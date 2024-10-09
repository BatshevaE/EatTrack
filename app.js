const express = require('express');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

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
