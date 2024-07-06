const rateLimit = require('express-rate-limit');
const {logEvents} = require('../middleware/logger');

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    message: {
        message: "Too many login attempts from this IP, please try again after 2 minutes"
    },
    handler: function (req, res, next) {
        logEvents(`Too Many Requests: ${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        res.status(429).send("Too many requests, please try again after 15 minutes");
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter