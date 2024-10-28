const express = require('express');

const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables




// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes for user-related actions
app.use('/', userRoutes);
/*app.post('/add-meal', upload.single('DescriptionImage'), (req, res) => {
    // Retrieve form data
    const username = req.body.username;
    const MealType = req.body.MealType;
    const Time = req.body.Time;
    const Date = req.body.Date;
    const DescriptionImage = req.file ? req.file.filename : 'No file uploaded';
    const Gram = req.body.Gram;
    const GlucoseLevelAfterTwoHours = req.body.GlucoseLevelAfterTwoHours;
    const Holiday = req.body.Holiday;

    // Print the received data on the console
    console.log(`Username: ${username}`);
    console.log(`Meal Type: ${MealType}`);
    console.log(`Time: ${Time}`);
    console.log(`Date: ${Date}`);
    console.log(`Description Image: ${DescriptionImage}`);
    console.log(`Gram: ${Gram}`);
    console.log(`Glucose Level After Two Hours: ${GlucoseLevelAfterTwoHours}`);
    console.log(`Holiday: ${Holiday}`);

    // Respond with a success message
    res.send('Meal data received successfully!');
});*/
// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

