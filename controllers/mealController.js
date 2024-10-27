const imaggaModel = require('../models/imaggaModel');

exports.addMeal = async (req, res) => {
    const { mealType, time, gram, glucoseLevelAfterTwoHours } = req.body;
    const imageFile = req.files ? req.files.DescriptionImage : null; // Check if files are present

    if (!imageFile) {
        console.error('No image data provided in the request.');
        return res.status(400).send('No image data provided.');
    }

    console.log('Uploaded Image File:', imageFile); // Log the image file details
    console.log('Image Data:', imageFile.data); // Log the image data

    try {
        // Convert the image file to base64 for Imagga API
        const imageDataUrl = imageFile.data.toString('base64'); // Convert to base64
        console.log('Base64 Image Data Length:', imageDataUrl.length); // Log the length

        // Get the highest-confidence tag from Imagga
        const description = await imaggaModel.getHighestConfidenceTag(imageDataUrl);

        // Prepare the new meal object
        const newMeal = { mealType, time, gram, glucoseLevel: glucoseLevelAfterTwoHours, description };

        // Save the new meal to the database
        await imaggaModel.addMealToDatabase(newMeal);

        // Retrieve the updated list of meals
        const username = req.body.username; // Assuming you have the username in the request
        const meals = await userModel.getAllMeals(username);

        // Render the index page with the updated meals
        res.render('pages/index', { username, meals, successMessage: 'Meal added successfully!' });
    } catch (error) {
        console.error('Error adding meal:', error);
        res.status(500).send('Error adding meal');
    }
};
