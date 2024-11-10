const imaggaModel = require('../models/imaggaModel');
const  cloudinaryModel= require('../models/cloudinaryModel');
const  hebcalModel= require('../models/hebcalModel');
const  usdaModel= require('../models/usdaModel');
const  userModel= require('../models/userModel');
const  predictController= require('../controllers/predictController.js');
const sendAlert = require('C:/cloud/alert/sendAlert');


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
            //DescriptionImage = await imaggaModel.getHighestConfidenceTag(cloudinaryUrl) || "No description available";
           DescriptionImage="pasta"
        }
        let GlucoseLevelInFood=await usdaModel.getGlucoseLevel(DescriptionImage,Gram)
        GlucoseLevelInFood = GlucoseLevelInFood || 0; // Default to 0 if null or undefined
        
        let PredictedGlucoseLevel=await predictController.predictGlucoseLevel(username,{MealType,Time, Date,DescriptionImage, Gram,GlucoseLevelAfterTwoHours,Holiday,GlucoseLevelInFood});
        console.log("Predicted sugar level:", PredictedGlucoseLevel);
        // Prepare meal data for database
        const mealData = {
            MealType,
            Time, 
            Date,
            DescriptionImage, 
            Gram,
            GlucoseLevelAfterTwoHours,
            Holiday,
            GlucoseLevelInFood,
            PredictedGlucoseLevel
        };
        if (mealData.GlucoseLevelAfterTwoHours > 110) {
            await sendAlert(username,mealData);
          }
        await userModel.addMealToDB(username, mealData);
       
        res.redirect(`/index?username=${username}`);
    } catch (error) {
        console.error('Failed to add meal:', error);
        res.status(500).send('Error adding meal');
    }
};
exports.predictGlucoseLevel = async (req, res) => {
    const { username, MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours } = req.body;
    let imageFilePath = req.file ? req.file.path : null;
    const Holiday=await hebcalModel.isJewishHoliday(Date);
    try {
        let DescriptionImage = "No image uploaded";
        
        if (imageFilePath) {
            // Step 1: Upload image to Cloudinary
            const cloudinaryUrl = await cloudinaryModel.uploadImageToCloudinary(imageFilePath);
            
            // Step 2: Send Cloudinary URL to Imagga to get the highest confidence tag
            //DescriptionImage = await imaggaModel.getHighestConfidenceTag(cloudinaryUrl) || "No description available";
           DescriptionImage="pasta"
        }
        let GlucoseLevelInFood=await usdaModel.getGlucoseLevel(DescriptionImage,Gram)
        GlucoseLevelInFood = GlucoseLevelInFood || 0; // Default to 0 if null or undefined
    
        // Calculate predicted glucose level (implement prediction logic)
        const predictedLevel =await predictController.predictGlucoseLevel(username,{MealType,Time, Date,DescriptionImage, Gram,GlucoseLevelAfterTwoHours,Holiday,GlucoseLevelInFood});
        if(DescriptionImage!=null)// & Gram!=null & Time!=null & Holiday!=null)
           res.json({ predictedLevel  });
    } catch (error) {
        console.error("Error predicting glucose level:", error);
        res.status(500).json({ error: "Failed to predict glucose level" });
    }
};
