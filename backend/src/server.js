import dotenv from 'dotenv';
import cluster from 'node:cluster';
import os from 'node:os';
import { app } from './app.js';
import { connectDB } from './config/database.js';
import { logger } from './config/logger.js';
import { connectRedis } from './config/redis.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
    logger.info(`Primary ${process.pid} is running`);

    // Fork workers for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.error(`Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });
} else {
    // Workers share the same TCP connection
    startServer();
}

async function startServer() {
    try {
        await connectDB();
        await connectRedis();
        
        // Initialize background workers
        if (process.env.NODE_ENV === 'production') {
            await import('./workers/email.worker.js');
        }
        
        logger.info("Database, Redis & Workers initialized !!");

        const server = app.listen(PORT, () => {
            logger.info(`⚙️  Server (Worker ${process.pid}) running on port: ${PORT}`);
        });

        // Graceful Shutdown
        const shutdown = () => {
            logger.info('Shutting down server...');
            server.close(() => {
                logger.info('Server closed. Exiting process.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! 💥', err);
            server.close(() => process.exit(1));
        });

    } catch (err) {
        logger.error("Failed to start server:", err);
        process.exit(1);
    }
}

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥', err);
    process.exit(1);
});
