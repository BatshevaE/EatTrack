const express = require('express');
const app = express();
const path = require('path');
const mssql = require('mssql'); // Import mssql for SQL Server connection
require('dotenv').config(); // Load environment variables
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
const port = 4000;

// Connect to the database
const dbConfig = process.env.DB_CONNECTION_STRING;

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request()
            .input('username', mssql.VarChar, username)            
            .input('password', mssql.VarChar, password)
            .query('SELECT * FROM Users WHERE username = @Username AND password = @Password');

        if (result.recordset.length > 0) {
            // Login successful, redirect to the desired page
            res.send('Login successful!');
        } else {
            // Invalid credentials
            res.send('Invalid username or password.');
        }

        await pool.close(); // Close the connection
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Server error.');
    }
});

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'pages', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
