// models/mealModel.js
const mssql = require('mssql');
require('dotenv').config();

const dbConfig = process.env.DB_CONNECTION_STRING;

async function addMealToDB(username, mealData) {
    try {
        const { MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours, Holiday } = mealData;
        const pool = await mssql.connect(dbConfig);
        await pool.request()
            .input('UserName', mssql.VarChar, username)
            .input('MealType', mssql.VarChar, MealType)
            .input('Time', mssql.Time, Time)
            .input('Date', mssql.Date, Date)
            .input('Gram', mssql.Int, Gram)
            .input('GlucoseLevelAfterTwoHours', mssql.Int, GlucoseLevelAfterTwoHours)
            .input('Holiday', mssql.Bit, Holiday === "true" ? 1 : 0)
            .query(`
                INSERT INTO UserMeals (UserName, MealType, Time, Date, Gram, GlucoseLevelAfterTwoHours, Holiday)
                VALUES (@UserName, @MealType, @Time, @Date, @Gram, @GlucoseLevelAfterTwoHours, @Holiday)
            `);
        await pool.close();
    } catch (error) {
        console.error('Failed to add meal:', error);
        throw new Error('Failed to add meal');
    }
}

module.exports = { addMealToDB };
