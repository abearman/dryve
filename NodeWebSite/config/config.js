var logger = require('../logger/logger');

var _env = process.env.NODE_ENV || 'development';

//
// Configuration
//
var _mongoBaseUrl;
var _databaseName = 'dryvedb';
var _usesHttps = false;
var _TAG = "DRYVE: ";
var _pingerTimeoutSeconds = 45;
var _usePinger = true;

if ('development' === _env) {
    _mongoBaseUrl = 'mongodb://localhost:27017/';
}
if ('production' === _env) {
    // Note: The templated user/password below are replaced as part of the build system
    _mongoBaseUrl = 'mongodb://{{MONGO_USER}}:{{MONGO_PASSWORD}}@ds043957.mongolab.com:43957/';
}

//
// See https://groups.google.com/forum/?fromgroups=#!topic/mongoose-orm/0bOPcbCD12Q for
// information regarding keep-alive
//
exports.databaseOptions = {
    /*
    replset: {
        strategy: 'ping',
        rs_name: 'somerepsetname',
        readSecondary: true,
        socketOptions: {
            keepAlive: 1
        }
    },
    */
    server: {
        poolSize: 10,
        auto_reconnect: true,
        socketOptions: {
            keepAlive: 1
        }
    }
};

exports.usesHttps = _usesHttps;
exports.connectionString = _mongoBaseUrl + _databaseName;
exports.TAG = _TAG;
exports.usePinger = _usePinger;
exports.pingerTimeoutSeconds = _pingerTimeoutSeconds;
exports.environment = _env;

exports.useLogging = function(useLogging) {
    logger.useLogging(useLogging);
};

exports.setPinger = function(usePinger, seconds) {
    _usePinger = usePinger;
    _pingerTimeoutSeconds = seconds;
};

//
// Primarily used for unit tests to set the database name
//
exports.setDatabaseName = function(dbName) {
    _databaseName = dbName;
};
