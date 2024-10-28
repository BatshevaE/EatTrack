const imaggaModel = require('../models/imaggaModel');
/*exports.addMeal = async (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const MealType = req.body.MealType;
    const Time = req.body.Time;
    const Date = req.body.Date;
    //const DescriptionImage = req.body.DescriptionImage;
    const Gram = req.body.Gram;
    const GlucoseLevelAfterTwoHours = req.body.GlucoseLevelAfterTwoHours;
    const Holiday = req.body.Holiday;
    //const DescriptionImage=imaggaModel.getHighestConfidenceTag(req.body.DescriptionImage)
    // Get the highest confidence tag for DescriptionImage
    let DescriptionImage = req.file ? req.file.path : null; // Path to the uploaded image

    try {
        if (DescriptionImage) {
            // Get the tag with highest confidence from Imagga
            const highestTag = await imaggaModel.getHighestConfidenceTag(DescriptionImage);
            DescriptionImage = highestTag || "No description available";
        } else {
            DescriptionImage = "No image uploaded";
        }
    
    // Create mealData object
const mealData = {
    MealType,
    Time, 
    Date,
    DescriptionImage, 
    Gram,
    GlucoseLevelAfterTwoHours,
    Holiday: Holiday === 'true' // Convert to boolean
};
console.log('Meal Data:', mealData);



    await imaggaModel.addMealToDB(username, mealData);
    res.redirect(`/index?username=${username}`);
} catch (error) {
    console.error('Failed to add meal:', error);
    res.status(500).send('Error adding meal');
}
};*/
exports.addMeal = async (req, res) => {
    const { username, MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours, Holiday } = req.body;
    let imageFilePath = req.file ? req.file.path : null;
    try {
        let DescriptionImage = "No image uploaded";
        
        if (imageFilePath) {
            // Step 1: Upload image to Cloudinary
            const cloudinaryUrl = await imaggaModel.uploadImageToCloudinary(imageFilePath);
            
            // Step 2: Send Cloudinary URL to Imagga to get the highest confidence tag
            DescriptionImage = await imaggaModel.getHighestConfidenceTag(cloudinaryUrl) || "No description available";
        }

        // Prepare meal data for database
        const mealData = {
            MealType,
            Time, 
            Date,
            DescriptionImage, 
            Gram,
            GlucoseLevelAfterTwoHours,
            Holiday: Holiday === 'true' // Convert to boolean
        };

        await imaggaModel.addMealToDB(username, mealData);
        res.redirect(`/index?username=${username}`);
    } catch (error) {
        console.error('Failed to add meal:', error);
        res.status(500).send('Error adding meal');
    }
};


