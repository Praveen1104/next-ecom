import multer from 'multer';
import path from 'path';

// Define storage settings for Multer. We save files temporarily to the local disk
// before they are uploaded to a cloud service like Cloudinary.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure you have a 'public/temp' directory in your root
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // Prepend a unique timestamp to prevent file overwrites
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

/**
 * Multer middleware instance.
 * Use this in routes to handle file uploads.
 * Example: upload.single('avatar') or upload.array('images', 5)
 */
export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
