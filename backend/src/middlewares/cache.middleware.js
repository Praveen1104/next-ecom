import { getCache, setCache } from '../utils/cache.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * Middleware to cache API responses in Redis.
 * Only caches GET requests.
 * 
 * @param {number} ttlInSeconds - Time to live in seconds (default: 3600/1 hour)
 */
export const cacheMiddleware = (ttlInSeconds = 3600) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Create a unique cache key based on the URL and query parameters
        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await getCache(key);

            if (cachedResponse) {
                return res.status(200).json(
                    new ApiResponse(200, cachedResponse, "Response served from cache")
                );
            }

            // If not in cache, override res.send/res.json to capture the response and save it to cache
            const originalJson = res.json;
            res.json = (data) => {
                // Only cache successful responses (2xx)
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // Extract data from ApiResponse if it's an instance of it
                    const dataToCache = data.data !== undefined ? data.data : data;
                    setCache(key, dataToCache, ttlInSeconds);
                }
                
                // Call the original res.json
                return originalJson.call(res, data);
            };

            next();
        } catch (error) {
            // If cache fails, just proceed to the next middleware
            next();
        }
    };
};
