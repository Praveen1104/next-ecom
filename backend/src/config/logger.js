import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format for Winston
const customFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Winston logger instance.
 * Logs output to console (with colors) in development, and to files in all environments.
 * Logs errors to `logs/error.log` and all requests/info to `logs/combined.log`.
 */
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        customFormat
    ),
    transports: [
        // Output logs to console
        new winston.transports.Console({
            format: combine(
                colorize(),
                customFormat
            ),
        }),
        // Write all logs with level `error` and below to `logs/error.log`
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs to `logs/combined.log`
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

export { logger };
