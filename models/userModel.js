const mssql = require('mssql');
require('dotenv').config(); // Load environment variables

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
            //.input('password', mssql.VarChar, password)
            .query('SELECT * FROM UserMeals WHERE UserName = @username');
        await pool.close();
        return result.recordset;
    } catch (err) {
        console.error('Database query failed', err);
        throw err;
    }
}

// Function to get meals within a specific date range

async function getMealsByDateRange(fromDate, toDate) {
    try {
        const pool = await mssql.connect(process.env.DB_CONNECTION_STRING); // Connect to the DB
        const result = await pool.request()
            .input('fromDate', mssql.Date, fromDate) // Bind the fromDate as a SQL Date type
            .input('toDate', mssql.Date, toDate)     // Bind the toDate as a SQL Date type
            .query(`
                SELECT * FROM UserMeals
                WHERE Date >= @fromDate AND Date <= @toDate
                ORDER BY Date ASC
            `);
        return result.recordset; // Return the filtered meal records
    } catch (err) {
        console.error('Error querying meals by date range:', err);
        throw err;
    }
}

module.exports = { findUserByUsernameAndPassword, findMealsByUsernameAndPassword,getMealsByDateRange };
