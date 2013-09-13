var CarsDAO = require('../controllers/cars').CarsDAO;
var sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var cars = new CarsDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";
        res.render('landing_page', {
            title: 'blog homepage',
            username: req.username
        });
    }

    this.displayCarsPage = function(req, res, next) {
        "use strict";

        cars.getCars(function(err, results) {
            "use strict";

            if (err) return next(err);

            return res.render('find_cars', {
                title: 'blog homepage',
                username: req.username,
                mycars: results
            });
        });
    }

    this.displayCarByPermalink = function(req, res, next) {
        "use strict";

        var permalink = req.params.permalink;

        cars.getCarByPermalink(permalink, function(err, car) {
            "use strict";

            if (err) return next(err);

            if (!car) return res.redirect("/car_not_found");

            return res.render('entry_template', {
                title: 'New Car',
                username: req.username,
                car: car,
                errors: ""
            });
        });
    }

    this.displayCarNotFound = function(req, res, next) {
        "use strict";
        return res.send('Sorry, car not found', 404);
    }

    this.displayNewCarPage = function(req, res, next) {
        "use strict";

        if (!req.username) return res.redirect("/login");

        return res.render('newcar_template', {
            subject: "",
            errors: "",
            username: req.username
        });
    }

    this.handleNewCar = function(req, res, next) {
        "use strict";

        var name = req.body.name;
        var make = req.body.make;
        var model = req.body.model;
        var year = req.body.year;
        var pricePerHr = req.body.pricePerHr;
        var pricePerDay = req.body.pricePerDay;
        var street = req.body.street;
        var city = req.body.city;
        var state = req.body.state;
        var zip = req.body.zip;

        if (!req.username) return res.redirect("/signup");

        cars.insertEntry(name, make, model, year, pricePerHr, pricePerDay, street, city, state, zip, function(err, permalink) {
            "use strict";

            if (err) return next(err);

            // now redirect to the blog permalink
            return res.redirect("/car/" + permalink)
        });
    }
}

module.exports = ContentHandler;
