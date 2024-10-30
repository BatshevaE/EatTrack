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
        if (tags.length > 0) {
            const highestConfidenceTag = tags.reduce((highest, tag) => 
                tag.confidence > highest.confidence ? tag : highest, tags[0]
            );
            return highestConfidenceTag.tag.en; // Return in English
        }
        return "Unknown food type"; // אם אין תיוגים, מוחזר ערך ברירת מחדל
    } catch (error) {
        console.error('Error tagging the image with Imagga:', error.response?.data || error.message);
        throw error;
    }
}


module.exports = { getHighestConfidenceTag };
