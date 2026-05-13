import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../modules/users/user.model.js';

/**
 * Middleware to verify JWT token and protect routes.
 * It checks the 'Authorization' header or cookies for a token.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided");
        }
        
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user from the database
        const user = await User.findById(decodedToken?._id).select("-password");
        
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        req.user = user;
        
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

/**
 * Middleware to restrict access to specific roles.
 * Must be used AFTER verifyJWT middleware.
 * 
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'SELLER')
 */
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            throw new ApiError(403, `Role: ${req.user?.role || 'Unknown'} is not allowed to access this resource`);
        }
        next();
    };
};
/**
 * Middleware to restrict access to the resource owner.
 * Assumes the resource has a field (default: 'user') that matches the current user's ID.
 * 
 * @param {import('mongoose').Model} model - The Mongoose model to query
 * @param {string} ownerField - The field name that stores the owner's ID
 */
export const authorizeOwner = (model, ownerField = 'user') => {
    return asyncHandler(async (req, res, next) => {
        const resourceId = req.params.id;
        const resource = await model.findById(resourceId);

        if (!resource) {
            throw new ApiError(404, "Resource not found");
        }

        // Check if user is the owner OR is an ADMIN
        if (resource[ownerField].toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            throw new ApiError(403, "You do not have permission to perform this action on this resource");
        }

        next();
    });
};
