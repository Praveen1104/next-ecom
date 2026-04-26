import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to append a unique Request ID to each incoming request.
 * This is useful for tracing requests through logs and debugging.
 * 
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function
 */
const appendRequestId = (req, res, next) => {
    // Check if the client already sent a request ID (e.g., from a microservice)
    const requestId = req.headers['x-request-id'] || uuidv4();
    
    // Attach to the request object so it can be used in downstream middleware/controllers
    req.id = requestId;
    
    // Also send it back in the response headers
    res.setHeader('x-request-id', requestId);
    
    next();
};

export { appendRequestId };
