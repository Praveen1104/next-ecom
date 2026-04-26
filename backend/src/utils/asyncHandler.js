/**
 * A wrapper to handle asynchronous express route controllers and middleware.
 * It catches any errors and passes them to the next() middleware (usually the global error handler).
 * 
 * @param {Function} requestHandler - The async function to be wrapped.
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Wrap the handler in a Promise.resolve to catch both synchronous and asynchronous errors
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler };
