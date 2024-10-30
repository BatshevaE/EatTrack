
const axios = require('axios');

async function isJewishHoliday (date) {
    const mealDate = new Date(date);
    const year = mealDate.getFullYear();
    const month = String(mealDate.getMonth() + 1).padStart(2, '0');
    const day = String(mealDate.getDate()).padStart(2, '0');
 
    const specificDate = `${year}-${month}-${day}`; // Format date as YYYY-MM-DD

    try {
        // Fetch holiday data in JSON format
        const response = await axios.get(`https://www.hebcal.com/hebcal?v=1&year=${year}&month=${month}&day=${day}&maj=on&min=on&mod=on&mf=on&ss=on&c=on&cfg=json`);
        
        // If items exist, check for yomtov
        if (response.data && response.data.items) {
            // Log each item to verify structure
            response.data.items.forEach(item => console.log("Item:", item));
            // Check for yomtov being true
            const isYomtov = response.data.items.some(item => item.yomtov === true && item.date===specificDate);
            const isHoliday = response.data.items.some(item => item.Holiday === true && item.date===specificDate);
            const isSaturday = mealDate.getDay()===6;
            console.log(isYomtov)
            console.log(isSaturday)
            // Alternative check: use category as 'holiday' if yomtov is missing
            return isYomtov || isHoliday||isSaturday;
        } else {
            console.error('Unexpected data format:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error fetching holiday data:', error.message);
        return false;
    }
}
isJewishHoliday (30/10/2024)
module.exports = { isJewishHoliday };
