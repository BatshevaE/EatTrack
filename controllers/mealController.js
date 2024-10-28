// controllers/mealController.js
const imaggaModel = require('../models/imaggaModel');
async function addMeal(req, res) {
  //  const { username, password } = req.body;
  const username = req.body.username || req.query.username;

    console.log(username)
    const mealData = {
        MealType: req.body.MealType,
        Time: req.body.Time,
        Date: req.body.Date,
        Gram: req.body.Gram,
        GlucoseLevelAfterTwoHours: req.body.GlucoseLevelAfterTwoHours,
        Holiday: req.body.Holiday,
    };
    /*const username = req.body.username;*/

    try {
        await imaggaModel.addMealToDB(username, mealData);
        /*res.redirect('/index'); // Redirect after successful addition*/
            // Redirect to the index page with username
            res.redirect(`/index?username=${username}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error adding meal');
    }
}

module.exports = { addMeal };
