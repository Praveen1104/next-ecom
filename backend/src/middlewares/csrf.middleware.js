import { doubleCsrf } from 'csrf-csrf';
import { ApiError } from '../utils/ApiError.js';

/**
 * Configure Double Submit Cookie CSRF protection.
 */
const csrf = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || "default_csrf_secret",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

export const {
    invalidCsrfTokenError,
    generateToken,
    doubleCsrfProtection,
    setToken,
} = csrf;

/**
 * Custom CSRF error handler middleware.
 */
export const csrfErrorHandler = (error, req, res, next) => {
    if (error === invalidCsrfTokenError) {
        return next(new ApiError(403, "Invalid CSRF token"));
    }
    next(error);
};
