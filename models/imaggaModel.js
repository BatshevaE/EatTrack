const axios = require('axios');
const sql = require('mssql'); // Import mssql for database interaction

require('dotenv').config();

const apiKey = process.env.ApiKeyImagga;
const apiSecret = process.env.APISecretImagga;

async function getHighestConfidenceTag(imageDataUrl) {
    try {
        const response = await axios.post('https://api.imagga.com/v2/tags', {
            image_base64: imageDataUrl.split(',')[1] // Extract base64 part from the data URL
        }, {
            auth: { username: apiKey, password: apiSecret },
        });

        const tags = response.data.result.tags;
        if (tags.length > 0) {
            return tags.reduce((highest, tag) =>
                tag.confidence > highest.confidence ? tag : highest, tags[0]
            ).tag.en;
        }
        return null;
    } catch (error) {
        console.error('Error tagging the image:', error.response?.data || error.message);
        throw error;
    }
}




// Function to insert a new meal into the database
async function addMealToDatabase(newMeal) {
    try {
        // Configure the database connection
        const pool = await sql.connect(process.env.DB_CONNECTION_STRING);
        const { mealType, time, gram, glucoseLevel, description } = newMeal;

        // SQL query to insert the new meal
        const query = `
            INSERT INTO Meals (MealType, Time, Gram, GlucoseLevel, Description)
            VALUES (@mealType, @time, @gram, @glucoseLevel, @description)
        `;

        // Execute the query
        await pool.request()
            .input('mealType', sql.VarChar, mealType)
            .input('time', sql.Time, time)
            .input('gram', sql.Int, gram)
            .input('glucoseLevel', sql.Float, glucoseLevel)
            .input('description', sql.VarChar, description)
            .query(query);

        console.log('Meal added to database successfully.');
    } catch (error) {
        console.error('Error inserting meal into database:', error);
        throw error; // Rethrow the error for handling in the controller
    }
}

module.exports = { getHighestConfidenceTag,addMealToDatabase };
