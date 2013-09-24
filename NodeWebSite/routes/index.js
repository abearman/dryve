var logger = require('../logger/logger');
var config = require('../config/config');
var SessionHandler = require('./session');
var ContentHandler = require('./content');
var ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db);
    var contentHandler = new ContentHandler(db);

    // Middleware to see if a user is logged in
    app.use(sessionHandler.isLoggedInMiddleware);

    // The main page of the blog
    app.get('/', contentHandler.displayMainPage);

    //The find page 
    app.get('/find_cars', contentHandler.displayCarsPage);

    //The car request page
    app.get('/car_request', contentHandler.displayCarRequestPage);
    app.post('/car_request', contentHandler.handleCarRequest);

    //The post car request page
    app.get('/post_car_request', contentHandler.displayPostCarRequestPage);

    // A single car, which can be commented on
    app.get("/car/:permalink", contentHandler.displayCarByPermalink);
    app.get("/car_not_found", contentHandler.displayCarNotFound);

    // Displays the form allowing a user to add a new car. Only works for logged in users
    app.get('/newcar', contentHandler.displayNewCarPage);
    app.post('/newcar', contentHandler.handleNewCar);

    // Login form
    app.get('/login', sessionHandler.displayLoginPage);
    app.post('/login', sessionHandler.handleLoginRequest);

    // Logout page
    app.get('/logout', sessionHandler.displayLogoutPage);

    // Signup form
    app.get('/signup', sessionHandler.displaySignupPage);
    app.post('/signup', sessionHandler.handleSignup);

    // Error handling middleware
    app.use(ErrorHandler);
}
