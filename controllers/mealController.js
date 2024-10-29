const imaggaModel = require('../models/imaggaModel');
exports.addMeal = async (req, res) => {
    const { username, MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours } = req.body;
    let imageFilePath = req.file ? req.file.path : null;
    const Holiday=await imaggaModel.isJewishHoliday(Date);
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
            Holiday
        };
        console.log(mealData)
        await imaggaModel.addMealToDB(username, mealData);
        res.redirect(`/index?username=${username}`);
    } catch (error) {
        console.error('Failed to add meal:', error);
        res.status(500).send('Error adding meal');
    }
};
  


