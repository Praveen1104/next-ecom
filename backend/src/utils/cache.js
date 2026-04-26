import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

/**
 * Get data from Redis cache
 * @param {string} key 
 * @returns {Promise<Object|null>} parsed JSON data
 */
export const getCache = async (key) => {
    try {
        const client = getRedisClient();
        if (!client || !client.isOpen) return null;

        const data = await client.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        logger.error(`Error getting cache for key ${key}: `, error);
        return null; // Fallback gracefully if cache fails
    }
};

/**
 * Set data in Redis cache
 * @param {string} key 
 * @param {Object} data 
 * @param {number} ttlInSeconds Time to live in seconds (e.g., 3600 for 1 hour)
 */
export const setCache = async (key, data, ttlInSeconds = 3600) => {
    try {
        const client = getRedisClient();
        if (!client || !client.isOpen) return;

        await client.setEx(key, ttlInSeconds, JSON.stringify(data));
    } catch (error) {
        logger.error(`Error setting cache for key ${key}: `, error);
    }
};

/**
 * Clear all cache keys matching a pattern (e.g., 'products:*')
 * Useful for cache invalidation when data changes.
 * @param {string} pattern 
 */
export const clearCachePattern = async (pattern) => {
    try {
        const client = getRedisClient();
        if (!client || !client.isOpen) return;

        // Note: For large datasets, keys() can block Redis. 
        // In production, consider using SCAN or a dedicated key-management strategy.
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(keys);
            logger.info(`Cleared ${keys.length} cache keys matching pattern ${pattern}`);
        }
    } catch (error) {
        logger.error(`Error clearing cache pattern ${pattern}: `, error);
    }
};
