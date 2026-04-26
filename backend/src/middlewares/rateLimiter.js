import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware to prevent brute-force attacks and abuse.
 * Restricts the number of requests a single IP address can make to the API within a specified time window.
 */
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per `windowMs`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        statusCode: 429
    },
    handler: (req, res, next, options) => {
        // You can also throw an ApiError here if you want it to pass through the global error handler
        res.status(options.statusCode).json(options.message);
    }
});

export { apiRateLimiter };
