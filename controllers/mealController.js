const imaggaModel = require('../models/imaggaModel');
exports.addMeal = async (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const MealType = req.body.MealType;
    const Time = req.body.Time;
    const Date = req.body.Date;
    const DescriptionImage = req.body.DescriptionImage;
    const Gram = req.body.Gram;
    const GlucoseLevelAfterTwoHours = req.body.GlucoseLevelAfterTwoHours;
    const Holiday = req.body.Holiday;
    //const DescriptionImage=imaggaModel.getHighestConfidenceTag(req.body.DescriptionImage)

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


try {
    await imaggaModel.addMealToDB(username, mealData);
    res.redirect(`/index?username=${username}`);
} catch (error) {
    console.error('Failed to add meal:', error);
    res.status(500).send('Error adding meal');
}
};
