const mssql = require('mssql');
require('dotenv').config();
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const apiKey = process.env.ApiKeyImagga;
const apiSecret = process.env.APISecretImagga;
// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
});
const dbConfig = process.env.DB_CONNECTION_STRING;

async function addMealToDB(username, mealData) {
    try {
        const { MealType, Date,DescriptionImage, Gram, GlucoseLevelAfterTwoHours, Holiday } = mealData;
        let { Time } = mealData; // Use `let` to modify the value

        // Validate and format Time
        if (Time) {
            const timeParts = Time.split(':');
            if (timeParts.length === 2) {
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);

                if (!isNaN(hours) && !isNaN(minutes)) {
                    // Format as "HH:mm:ss"
                    Time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
                } else {
                    console.error('Invalid time provided:', Time);
                    return res.status(400).send('Invalid time format');
                }
            } else {
                console.error('Time format incorrect:', Time);
                return res.status(400).send('Invalid time format');
            }
        } else {
            console.error("Time is missing or invalid in request:", Time);
            return res.status(400).send("Time is required");
        }

        const pool = await mssql.connect(dbConfig);
        await pool.request()
            .input('UserName', mssql.VarChar, username)
            .input('MealType', mssql.VarChar, MealType)
            .input('Time', mssql.VarChar, Time) 
            .input('Date', mssql.Date, Date)
            .input('DescriptionImage', mssql.VarChar, DescriptionImage)
            .input('Gram', mssql.Int, Gram)
            .input('GlucoseLevelAfterTwoHours', mssql.Int, GlucoseLevelAfterTwoHours)
            .input('Holiday', mssql.Bit, Holiday === "true" ? 1 : 0)
            .query(`
                INSERT INTO UserMeals (UserName, MealType, Time, Date,Description , Gram, GlucoseLevelAfterTwoHours, Holiday)
                VALUES (@UserName, @MealType, @Time, @Date,@DescriptionImage, @Gram, @GlucoseLevelAfterTwoHours, @Holiday)
            `);
        await pool.close();
    } catch (error) {
        console.error('Failed to add meal:', error);
        throw new Error('Failed to add meal');
    }
}

async function uploadImageToCloudinary(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.secure_url;
    } catch (error) {
        console.error("Failed to upload image to Cloudinary:", error.message);
        throw error;
    }
}

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

/*async function getHighestConfidenceTag(imagePath) {
    try {
        // Read the image file
        const imageFile = fs.createReadStream(imagePath);

        // Send the file to Imagga API
        const response = await axios.post('https://api.imagga.com/v2/tags', 
            { image: imageFile },
            {
                auth: {
                    username: apiKey,
                    password: apiSecret,
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        // Parse and get the tag with the highest confidence
        const tags = response.data.result.tags;
        if (tags.length > 0) {
            const highestConfidenceTag = tags.reduce((highest, tag) => 
                tag.confidence > highest.confidence ? tag : highest, tags[0]
            );
            console.log(highestConfidenceTag.tag.en)
            return highestConfidenceTag.tag.en; // Return the highest confidence tag in English
        }
        return null; // Return null if no tags found
    } catch (error) {
        console.error('Error tagging the image:', error.response?.data || error.message);
        throw error; // Rethrow the error for further handling
    }
}*/

// Usage Example
// getHighestConfidenceTag('path_to_your_image.jpg').then(console.log).catch(console.error);

module.exports = { addMealToDB, uploadImageToCloudinary, getHighestConfidenceTag };
