import { emailQueue } from '../config/queue.js';
import { logger } from '../config/logger.js';

/**
 * Add an email job to the background queue.
 * @param {Object} emailData - { to, subject, body }
 */
export const enqueueEmail = async (emailData) => {
    try {
        const job = await emailQueue.add('send-email', emailData);
        logger.info(`Email job enqueued: ${job.id}`);
        return job;
    } catch (error) {
        logger.error('Failed to enqueue email job:', error);
        throw error;
    }
};
