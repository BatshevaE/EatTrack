const imaggaModel = require('../models/imaggaModel');
const  cloudinaryModel= require('../models/cloudinaryModel');
const  hebcalModel= require('../models/hebcalModel');
const  usdaModel= require('../models/usdaModel');
const  userModel= require('../models/userModel');

exports.addMeal = async (req, res) => {
    const { username, MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours } = req.body;
    let imageFilePath = req.file ? req.file.path : null;
    const Holiday=await hebcalModel.isJewishHoliday(Date);
    try {
        let DescriptionImage = "No image uploaded";
        
        if (imageFilePath) {
            // Step 1: Upload image to Cloudinary
            const cloudinaryUrl = await cloudinaryModel.uploadImageToCloudinary(imageFilePath);
            
            // Step 2: Send Cloudinary URL to Imagga to get the highest confidence tag
            DescriptionImage = await imaggaModel.getHighestConfidenceTag(cloudinaryUrl) || "No description available";
        }
        let GlucoseLevelInFood=await usdaModel.getGlucoseLevel(DescriptionImage,Gram)
        GlucoseLevelInFood = GlucoseLevelInFood || 0; // Default to 0 if null or undefined

        // Prepare meal data for database
        const mealData = {
            MealType,
            Time, 
            Date,
            DescriptionImage, 
            Gram,
            GlucoseLevelAfterTwoHours,
            Holiday,
            GlucoseLevelInFood
        };
        console.log(mealData)
        await userModel.addMealToDB(username, mealData);
        res.redirect(`/index?username=${username}`);
    } catch (error) {
        console.error('Failed to add meal:', error);
        res.status(500).send('Error adding meal');
    }
};
  


