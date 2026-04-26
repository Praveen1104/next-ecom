import dotenv from 'dotenv'; // Restarting to pick up .env changes
import { app } from './app.js';
import { connectDB } from './config/database.js';
import { logger } from './config/logger.js';
import { connectRedis } from './config/redis.js';

// Load environment variables from .env file into process.env
dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and then start the Express server
connectDB()
    .then(async () => {
        // Connect to Redis before starting the server
        await connectRedis();
        logger.info("Redis is also connected !!");

        const server = app.listen(PORT, () => {
            logger.info(`⚙️  Server is running on port: ${PORT}`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
        });

        // Handle unhandled promise rejections (e.g., failed database connections)
        process.on('unhandledRejection', (err) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
            // Gracefully shut down the server before exiting the process
            server.close(() => {
                process.exit(1);
            });
        });
    })
    .catch((err) => {
        logger.error("MONGO db connection failed !!! ", err);
    });

// Handle uncaught exceptions (e.g., synchronous errors outside of express routes)
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1);
});
