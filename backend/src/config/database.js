import mongoose from 'mongoose';
import { logger } from './logger.js';

/**
 * Connects to the MongoDB database using Mongoose.
 * Retries connection or exits the process if the connection fails initially.
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error("MONGODB connection FAILED: ", error);
        process.exit(1);
    }
};

export { connectDB };
