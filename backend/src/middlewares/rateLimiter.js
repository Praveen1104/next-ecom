import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient } from '../config/redis.js';

/**
 * Rate limiting middleware using Redis for storage.
 * Restricts the number of requests a single IP address can make to the API.
 */
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per `windowMs`
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => getRedisClient().sendCommand(args),
    }),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        statusCode: 429
    },
});

export { apiRateLimiter };
