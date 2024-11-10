const axios = require('axios');
require('dotenv').config(); // Load environment variables
const apiKeyUsda = process.env.API_KEY_USDA

/**
 * Gets the glucose level (in grams) in the specified amount of a given food.
 * @param {string} foodName - The name of the food to search for.
 * @param {number} gramAmount - The amount of the food in grams.
 * @returns {Promise<number|null>} - The glucose level in the specified gram amount of the food, or null if not found.
 */
async function getGlucoseLevel(foodItem, gramAmount) {
    try {
        const response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
            params: {
                query: foodItem,
                api_key: apiKeyUsda,
            },
        });

        // Check if the results are available
        if (response.data.foods && response.data.foods.length > 0) {
            const food = response.data.foods[0]; // Get the first food item
            const calories = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy');
            
            if (calories) {
                return calories.value*gramAmount /100;
            } else {
                console.log(`Calorie information for ${foodItem} not found.`);
            }
        } else {
            console.log(`No food found for "${foodItem}".`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
    }
    
}
module.exports = { getGlucoseLevel };

