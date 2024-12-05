const axios = require('axios');
require('dotenv').config(); // Load environment variables
const apiKey = process.env.ApiKeyImagga;
const apiSecret = process.env.APISecretImagga;



async function getHighestConfidenceTag(imageUrl) {
    try {
        const response = await axios.get('https://api.imagga.com/v2/tags', {
            params: { image_url: imageUrl },
            auth: {
                username: process.env.ApiKeyImagga,
                password: process.env.APISecretImagga,
            }
        });
        const tags = response.data.result.tags;
        
                
        if (tags.length > 0 && isFoodImage(tags)) {
            const highestConfidenceTag = tags.reduce((highest, tag) => 
                tag.confidence > highest.confidence ? tag : highest, tags[0]
            );
            return highestConfidenceTag.tag.en; // Return in English
        }
        return "Unknown food type"; //return defult value if there is no data
    } catch (error) {
        console.error('Error tagging the image with Imagga:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Checks if the image contains food-related tags.
 * @param {Array} tags - The list of tags from the Imagga API.
 * @returns {boolean} - True if the image contains food-related tags, otherwise false.
 */
const isFoodImage = (tags) => {
    // Define a list of common food-related keywords
    const foodKeywords = ['food', 'meal', 'dish', 'snack', 'breakfast', 'lunch', 'dinner', 'pasta', 'pizza', 'fruit', 'vegetable', 'drink'];
  
    // Check if any of the tags contain food-related keywords
    return tags.some(tag => foodKeywords.includes(tag.tag.en.toLowerCase()));
  };

module.exports = { getHighestConfidenceTag };
