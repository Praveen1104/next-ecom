/**
 * Custom Error class to define specific API errors.
 * Extends the default built-in Error class.
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
     * @param {string} message - Descriptive error message
     * @param {Array} errors - Additional error details (useful for validation errors)
     * @param {string} stack - Stack trace (optional, will be captured automatically if not provided)
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false; // By default API errors are not successful
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
