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
            
            // Log the meals to see if any data is being fetched
            //console.log('Meals fetched for user:', username, meals);
            
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

