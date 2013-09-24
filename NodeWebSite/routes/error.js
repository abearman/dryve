// Error handling middleware

var logger = require('../logger/logger');
var config = require('../config/config');

exports.errorHandler = function(err, req, res, next) {
    "use strict";
    logger.bunyanLogger().info("%s%s", config.TAG, err.message);
    logger.bunyanLogger().info("%s%s", config.TAG, err.stack);
    res.status(500);
    res.render('error_template', { error: err });
}
