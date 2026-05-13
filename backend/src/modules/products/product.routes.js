import { Router } from 'express';
import { getProducts, getProductById, createProduct } from './product.controller.js';
import { exportProductsCSV } from './product.stream.controller.js';
import { verifyJWT, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware.js';

const router = Router();

// Public routes
router.get("/", cacheMiddleware(600), getProducts); // Cache for 10 minutes
router.get("/export-csv", exportProductsCSV); // Streaming endpoint
router.get("/:id", cacheMiddleware(3600), getProductById); // Cache for 1 hour

// Secured Routes
// Only ADMIN or SELLER can create products. 
// Uses multer's .array() to accept up to 5 images.
router.post(
    "/", 
    verifyJWT, 
    authorizeRoles('ADMIN', 'SELLER'), 
    idempotencyMiddleware,
    upload.array('images', 5), 
    createProduct
);

export default router;
