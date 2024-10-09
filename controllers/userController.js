const userModel = require('../models/userModel');

// Handle login logic
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findUserByUsernameAndPassword(username, password);
        if (user.length > 0) {
            // Redirect to the index page with username
            res.redirect(`/index?username=${username}`);
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error.');
    }
};

// Render the login page
exports.renderLoginPage = (req, res) => {
    res.render('pages/login');
};

// Render the index page with username
exports.renderIndexPage = (req, res) => {
    const username = req.query.username || null;
    res.render('pages/index', { username });
};
