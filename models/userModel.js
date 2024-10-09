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

module.exports = { findUserByUsernameAndPassword };
