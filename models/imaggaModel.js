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
            .input('Holiday', mssql.Bit, Holiday)
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
async function isJewishHoliday (date) {
    const mealDate = new Date(date);
    const year = mealDate.getFullYear();
    const month = String(mealDate.getMonth() + 1).padStart(2, '0');
    const day = String(mealDate.getDate()).padStart(2, '0');

    try {
        // Fetch holiday data in JSON format
        const response = await axios.get(`https://www.hebcal.com/hebcal/?v=1&year=${year}&month=${month}&day=${day}&maj=on&min=on&mod=on&nx=on&mf=on&c=on&cfg=json`);
        
        // If items exist, check for yomtov
        if (response.data && response.data.items) {
            // Log each item to verify structure
            response.data.items.forEach(item => console.log("Item:", item));

            // Check for yomtov being true
            const isYomtov = response.data.items.some(item => item.yomtov === true);
            console.log(isYomtov)
            // Alternative check: use category as 'holiday' if yomtov is missing
            return isYomtov || response.data.items.some(item => item.category === 'holiday');
        } else {
            console.error('Unexpected data format:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error fetching holiday data:', error.message);
        return false;
    }
}
module.exports = { addMealToDB, uploadImageToCloudinary, getHighestConfidenceTag,isJewishHoliday };
