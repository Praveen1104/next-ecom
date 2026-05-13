import { Queue, Worker } from 'bullmq';
import { logger } from './logger.js';

const REDIS_OPTIONS = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    // Add password if exists
};

/**
 * Initialize a BullMQ queue.
 * @param {string} name - The name of the queue.
 */
export const createQueue = (name) => {
    const queue = new Queue(name, {
        connection: REDIS_OPTIONS,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    });

    queue.on('error', (err) => {
        logger.error(`Queue ${name} error:`, err);
    });

    return queue;
};

export const emailQueue = createQueue('email-queue');
