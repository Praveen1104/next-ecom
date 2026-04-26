import { ApiError } from '../utils/ApiError.js';

/**
 * Generic validation middleware using Zod.
 * Validates request body, query, or params against a Zod schema.
 * 
 * @param {import('zod').AnyZodObject} schema - The Zod schema to validate against
 * @param {string} property - Which part of the request to validate ('body', 'query', 'params')
 */
export const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        try {
            // Parse and validate the request data
            const validatedData = schema.parse(req[property]);
            
            // Replace the request data with the validated (and potentially typed/transformed) data
            req[property] = validatedData;
            
            next();
        } catch (error) {
            // If it's a Zod error, format it nicely
            if (error.errors) {
                const errorMessages = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return next(new ApiError(400, "Validation Error", errorMessages));
            }
            // For other unexpected errors
            next(error);
        }
    };
};
