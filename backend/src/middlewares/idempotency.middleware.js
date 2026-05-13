import { getRedisClient } from '../config/redis.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

/**
 * Middleware to handle request deduplication (idempotency).
 * Uses an 'x-idempotency-key' header to identify unique requests.
 * Stores the key in Redis for a short duration (e.g., 24 hours).
 */
export const idempotencyMiddleware = async (req, res, next) => {
    // Only check for non-GET requests
    if (req.method === 'GET') {
        return next();
    }

    const idempotencyKey = req.headers['x-idempotency-key'];

    if (!idempotencyKey) {
        // If no key is provided, we can either allow it or require it.
        // For now, let's allow it but log a warning.
        return next();
    }

    try {
        const client = getRedisClient();
        if (!client || !client.isOpen) return next();

        const redisKey = `idempotency:${idempotencyKey}`;
        
        // Try to set the key with a TTL (e.g., 24 hours)
        // NX: set if not exists
        const result = await client.set(redisKey, 'started', {
            NX: true,
            EX: 24 * 60 * 60
        });

        if (!result) {
            // Key already exists, request is a duplicate
            throw new ApiError(409, "Duplicate request detected. Please wait for the previous request to complete.");
        }

        // If it's a new request, we proceed and potentially store the result later 
        // (but for simplicity, we just mark it as "started" for now).
        // A more advanced version would store the response and return it immediately.

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        logger.error(`Idempotency middleware error: `, error);
        next();
    }
};
