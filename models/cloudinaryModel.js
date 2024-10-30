const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY
});
async function uploadImageToCloudinary(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath);
        return result.secure_url;
    } catch (error) {
        console.error("Failed to upload image to Cloudinary:", error.message);
        throw error;
    }
}
module.exports = { uploadImageToCloudinary };
