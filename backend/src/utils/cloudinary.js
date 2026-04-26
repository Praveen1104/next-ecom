import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { logger } from '../config/logger.js';

// Configuration will be picked from environment variables automatically if names match,
// but it's good practice to set it explicitly.
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

/**
 * Uploads a file from the local file system to Cloudinary and deletes the local file.
 * 
 * @param {string} localFilePath - The absolute path of the local file.
 * @returns {Object|null} The Cloudinary upload response object or null if failed.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detect if it's an image, video, etc.
        });
        
        // File has been uploaded successfully
        logger.info(`File uploaded successfully to cloudinary: ${response.url}`);
        
        // Remove the locally saved temporary file
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
             fs.unlinkSync(localFilePath);
        }
        logger.error("Error uploading to Cloudinary: ", error);
        return null;
    }
}

export { uploadOnCloudinary };
