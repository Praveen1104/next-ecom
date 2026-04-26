/**
 * Custom class to structure API responses consistently across the application.
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code (e.g., 200, 201)
     * @param {any} data - The actual payload being returned
     * @param {string} message - A brief message explaining the response
     */
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        // The request is successful if the status code is strictly less than 400
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
