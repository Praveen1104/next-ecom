import { ApiError } from '../utils/ApiError.js';

/**
 * Global error handling middleware.
 * Intercepts all errors thrown in the application and formats them into a standard API response.
 * 
 * @param {Error} err - The error object thrown
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // Check if the error is an instance of ApiError, if not, create one.
    // This catches Mongoose errors, generic JavaScript errors, etc.
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    // Format the response payload
    const response = {
        ...error,
        message: error.message,
        // Include stack trace only in development environment for security
        ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
    };

    // Send the error response
    return res.status(error.statusCode).json(response);
};

export { errorHandler };
