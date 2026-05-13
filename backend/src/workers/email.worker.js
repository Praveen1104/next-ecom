import { Worker } from 'bullmq';
import { logger } from '../config/logger.js';

/**
 * Worker for processing email jobs.
 */
const emailWorker = new Worker('email-queue', async (job) => {
    const { to, subject, body } = job.data;
    
    logger.info(`[Worker ${process.pid}] Processing email to ${to}: ${subject}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, use Nodemailer here:
    // await sendEmail({ to, subject, body });

    logger.info(`[Worker ${process.pid}] Email sent successfully to ${to}`);
}, {
    connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
    concurrency: 5 // Process 5 jobs at a time
});

emailWorker.on('completed', (job) => {
    logger.info(`Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} has failed with ${err.message}`);
});

export { emailWorker };
