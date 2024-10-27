const axios = require('axios');
require('dotenv').config(); // Load environment variables

const apiKey = process.env.ApiKeyImagga;
const apiSecret = process.env.APISecretImagga;
// Replace these with your actual Imagga API credentials

async function tagImage(imageUrl) {
    try {
        const response = await axios.get('https://api.imagga.com/v2/tags', {
            params: { image_url: imageUrl },
            auth: {
                username: apiKey,
                password: apiSecret,
            },
        });

        // Parse and display the tags
        const tags = response.data.result.tags;
        console.log('Tags for the image:');
        tags.forEach(tag => {
            console.log(`Tag: ${tag.tag.en}, Confidence: ${tag.confidence}`);
        });
    } catch (error) {
        console.error('Error tagging the image:', error.response ? error.response.data : error.message);
    }
}

// The image URL you provided
//const imageUrl = 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/658A0A74-039A-487C-A07A-CAAF61B4615D/Derivates/CEB0611B-A236-4CFD-A68E-BE5DE026367F.jpg';
const imageUrl='https://ynet-pic1.yit.co.il/cdn-cgi/image/f=auto,w=740,q=75/picserver5/crop_images/2019/03/24/9141386/9141386_0_0_1620_1080_x-large.jpg'
tagImage(imageUrl);
