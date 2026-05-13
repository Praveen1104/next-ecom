import { doubleCsrf } from 'csrf-csrf';
import { ApiError } from '../utils/ApiError.js';

/**
 * Configure Double Submit Cookie CSRF protection.
 */
const {
    invalidCsrfTokenError, // This is a specific error we can check for
    generateToken, // Use this to generate a token for the frontend
    doubleCsrfProtection, // This is the middleware
    setToken, // Use this to set the token in the response
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "default_csrf_secret",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

/**
 * Custom CSRF error handler middleware.
 */
export const csrfErrorHandler = (error, req, res, next) => {
    if (error === invalidCsrfTokenError) {
        return next(new ApiError(403, "Invalid CSRF token"));
    }
    next(error);
};

export { generateToken, doubleCsrfProtection };
