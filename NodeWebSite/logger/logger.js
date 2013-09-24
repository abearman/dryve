var bunyan = require('bunyan');

var _useLogging = true;

var _stubLogger = {
    info: function() {},
    trace: function() {},
    error: function() {}
};

var _bunyanLogger = bunyan.createLogger({
    name: 'dryve',
    streams: [
        {
            level: 'trace',
            path: './logfiles/dryve-info.log',
            type: 'rotating-file',
            period: '1d',
            count: 10
        },
        {
            level: 'error',
            path: './logfiles/dryve-errors.log',
            type: 'rotating-file',
            period: '1d',
            count: 10
        },
        {
            stream: process.stdout,
            level: 'trace'
        }
    ],
    serializers: {
        req: reqSerializer,
        res: resSerializer,
        err: errorSerializer
    }
});

exports.useLogging = function(useLogging) {
    _useLogging = useLogging;
}

exports.bunyanLogger = function () {
    return _useLogging ? _bunyanLogger : _stubLogger;
}

function reqSerializer(req) {
    if (!req || !req.connection)
        return req;
    return {
        req_id: req._id,
        method: req.method,
        url: req.url,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort
    };
}

function resSerializer(res) {
    if (!res || !res.statusCode)
        return res;
    return {
        req_id: res.req._id,
        statusCode: res.statusCode,
        header: res._header
    }
}

function errorSerializer(err) {
    return err;
}