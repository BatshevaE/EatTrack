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

// Render the index page with username and meals
exports.renderIndexPage = async (req, res) => {
    const username = req.query.username || null;
    if (username) {
        try {
            // Fetch the meals for the logged-in user
            const meals = await userModel.findMealsByUsernameAndPassword(username);
            // Render the index page with meals
            res.render('pages/index', { username, meals });

        } catch (error) {
            console.error('Error fetching meals:', error);
            res.status(500).send('Server error while fetching meals.');
        }
    } else {
        // If no username is provided, just render the page with an empty meals array
        res.render('pages/index', { username: null, meals: [] });
    }
};

exports.filterMealsByDate = async (req, res) => {
    const { fromDate, toDate } = req.query; // Capture the dates sent from the front-end
    const username=req.query.username;
    try {
        const filteredMeals = await userModel.getMealsByDateRange(username,fromDate, toDate);
        res.render('pages/index', { username,meals: filteredMeals });
    } catch (error) {
        res.status(500).send('Error filtering meals by date');
    }
};
// Render the sign-up page
exports.renderSignUpPage = (req, res) => {
    res.render('pages/signup');
};

// Add a new user to the database
exports.addUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Call the function to add the user in the model
        await userModel.addUserToDB(username, password);
        res.redirect('/login'); // Redirect to login after sign-up
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Failed to sign up user');
    }
};
