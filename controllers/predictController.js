/*const mssql = require('mssql');
const { DecisionTreeClassifier } = require('ml-cart');

const dbConfig = process.env.DB_CONNECTION_STRING;

// Function to fetch meals for a user
async function getMealsForPrediction(username) {
    try {  
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .query(`SELECT MealType, Gram, Time, Holiday, GlucoseLevelAfterTwoHours FROM UserMeals WHERE username = @username`); // Ensure correct table
        await pool.close();
        return result.recordset;
    } catch (error) {
        console.error('Failed to fetch meals for prediction:', error);
        throw new Error('Database query error');
    }
}

// Function to convert categorical data to numerical values
function encodeFeatures(meals) {
    const mealTypeMap = {};
    const holidayMap = { true: 1, false: 0 };

    meals.forEach((meal) => {
        if (!mealTypeMap[meal.MealType]) {
            mealTypeMap[meal.MealType] = Object.keys(mealTypeMap).length + 1; // Simple mapping
        }
    });

    return meals.map(meal => {
        const gram = parseFloat(meal.Gram); // Ensure gram is a number
        const hour = new Date(meal.Time).getHours(); // Extract hour from Time
        const holiday = holidayMap[meal.Holiday.toString()] || 0; // Convert holiday to 1 or 0

        // Log to debug if gram or hour is NaN
        if (isNaN(gram) || isNaN(hour)) {
            console.error('Non-numeric value found in features:', meal);
            return null; // Return null if there's an invalid value
        }

        return [
            mealTypeMap[meal.MealType] || 0, // Encode MealType
            gram, // Numeric value
            hour, // Numeric value
            holiday // Numeric value
        ];
    }).filter(feature => feature !== null); // Filter out any null entries
}

// Function to train the decision tree and predict glucose level
async function predictGlucoseLevel(username, newMealData) {
    const meals = await getMealsForPrediction(username);
    const features = encodeFeatures(meals);
    const labels = meals.map(meal => parseFloat(meal.GlucoseLevelAfterTwoHours)); // Ensure labels are numeric

    const classifier = new DecisionTreeClassifier();
    classifier.train(features, labels);

    const newMealFeatures = [
        parseFloat(newMealData.Gram), // Ensure this is numeric
        new Date(newMealData.Time).getHours(), // Numeric hour
        newMealData.Holiday ? 1 : 0 // Numeric holiday
    ];

    const predictedGlucoseLevel = classifier.predict([newMealFeatures]);
    return predictedGlucoseLevel;
}

module.exports = { predictGlucoseLevel };*/
const mssql = require('mssql');
const { DecisionTreeClassifier } = require('ml-cart');

const dbConfig = process.env.DB_CONNECTION_STRING;

// Function to fetch meals for a user
async function getMealsForPrediction(username) {
    try {  
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .query(`SELECT Gram, Time, Holiday, GlucoseLevelAfterTwoHours, Description FROM UserMeals WHERE username = @username`); // Ensure correct table
        await pool.close();
        return result.recordset;
    } catch (error) {
        console.error('Failed to fetch meals for prediction:', error);
        throw new Error('Database query error');
    }
}

// Function to convert categorical data to numerical values
function encodeFeatures(meals) {
    const holidayMap = { true: 1, false: 0 };
    const descriptionMap = {};

    meals.forEach((meal) => {
        if (!descriptionMap[meal.Description]) {
            descriptionMap[meal.Description] = Object.keys(descriptionMap).length + 1; // Simple mapping
        }
    });

    return { 
        encodedFeatures: meals.map(meal => {
            const gram = parseFloat(meal.Gram); // Ensure gram is a number
            const hour = new Date(meal.Time).getHours(); // Extract hour from Time
            const holiday = holidayMap[meal.Holiday.toString()] || 0; // Convert holiday to 1 or 0

            // Log to debug if gram or hour is NaN
            if (isNaN(gram) || isNaN(hour)) {
                console.error('Non-numeric value found in features:', meal);
                return null; // Return null if there's an invalid value
            }

            return [
                gram, // Numeric value for Gram
                hour, // Numeric value for Hour
                holiday, // Numeric value for Holiday
                descriptionMap[meal.Description] || 0 // Encode Description
            ];
        }).filter(feature => feature !== null), // Filter out any null entries
        descriptionMap // Return the description map for later use
    };
}

// Function to train the decision tree and predict glucose level
async function predictGlucoseLevel(username, newMealData) {
    const meals = await getMealsForPrediction(username);
    const { encodedFeatures, descriptionMap } = encodeFeatures(meals); // Destructure to get encoded features and description map
    const labels = meals.map(meal => parseFloat(meal.GlucoseLevelAfterTwoHours)); // Ensure labels are numeric

    const classifier = new DecisionTreeClassifier();
    classifier.train(encodedFeatures, labels);

    const newMealFeatures = [
        parseFloat(newMealData.Gram), // Ensure this is numeric
        new Date(newMealData.Time).getHours(), // Numeric hour
        newMealData.Holiday ? 1 : 0, // Numeric holiday
        descriptionMap[newMealData.Description] || 0 // Encode Description
    ];

    const predictedGlucoseLevel = classifier.predict([newMealFeatures]);
    return predictedGlucoseLevel;
}

module.exports = { predictGlucoseLevel };

