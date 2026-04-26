import { createClient } from 'redis';
import { logger } from './logger.js';

let redisClient;

export const connectRedis = async () => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL
        });

        redisClient.on('error', (err) => {
            logger.error('Redis Client Error', err);
        });

        redisClient.on('connect', () => {
            logger.info('Redis client connected successfully');
        });

        await redisClient.connect();
    } catch (error) {
        logger.error('Redis connection failed', error);
        // We don't exit the process here so the app can fallback to DB if Redis fails
    }
};

export const getRedisClient = () => {
    if (!redisClient) {
        logger.error('Redis client has not been initialized. Call connectRedis first.');
    }
    return redisClient;
};
