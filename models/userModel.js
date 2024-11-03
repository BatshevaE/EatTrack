const mssql = require('mssql');
require('dotenv').config(); // Load environment variables
//const fs = require('fs');
const dbConfig = process.env.DB_CONNECTION_STRING;

async function findUserByUsernameAndPassword(username, password) {
    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('password', mssql.VarChar, password)
            .query('SELECT * FROM Users WHERE username = @username AND password = @password');
        await pool.close();
        return result.recordset;
    } catch (error) {
        throw new Error('Database query error');
    }
}

async function findMealsByUsernameAndPassword(username) {
    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .query('SELECT * FROM UserMeals WHERE UserName = @username ORDER BY Date ASC');
        await pool.close();
        return result.recordset;
    } catch (err) {
        console.error('Database query failed', err);
        throw err;
    }
}

// Function to get meals within a specific date range

async function getMealsByDateRange(username,fromDate, toDate) {
    try {
        const pool = await mssql.connect(dbConfig); // Connect to the DB
        const result = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('fromDate', mssql.Date, fromDate) // Bind the fromDate as a SQL Date type
            .input('toDate', mssql.Date, toDate)     // Bind the toDate as a SQL Date type
            .query(`
                SELECT * FROM UserMeals
                WHERE 
                Date >= @fromDate 
                AND Date <= @toDate
                AND UserName= @username
                ORDER BY Date ASC
            `);
            
        return result.recordset; // Return the filtered meal records
    } catch (err) {
        console.error('Error querying meals by date range:', err.message); // Log the error message
        console.error('Stack trace:', err.stack); // Log the stack trace
        throw err; // Rethrow the error for further handling
    }
}
async function addMealToDB(username, mealData) {
    try {
        const { MealType, Date,DescriptionImage, Gram, GlucoseLevelAfterTwoHours, Holiday,GlucoseLevelInFood,PredictedGlucoseLevel } = mealData;
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
            .input('GlucoseLevelInFood', mssql.Int, GlucoseLevelInFood)
            .input('PredictedGlucoseLevel', mssql.Float, PredictedGlucoseLevel)
            .query(`
                INSERT INTO UserMeals (UserName, MealType, Time, Date,Description , Gram, GlucoseLevelAfterTwoHours, Holiday,GlucoseLevelInFood,PredictedGlucoseLevel)
                VALUES (@UserName, @MealType, @Time, @Date,@DescriptionImage, @Gram, @GlucoseLevelAfterTwoHours, @Holiday,@GlucoseLevelInFood,@PredictedGlucoseLevel)
            `);
        await pool.close();
    } catch (error) {
        console.error('Failed to add meal:', error);
        throw new Error('Failed to add meal');
    }
}

module.exports = { findUserByUsernameAndPassword, findMealsByUsernameAndPassword,getMealsByDateRange,addMealToDB };
