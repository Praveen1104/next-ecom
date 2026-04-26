import { Router } from 'express';
import { getProducts, getProductById, createProduct } from './product.controller.js';
import { verifyJWT, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Secured Routes
// Only ADMIN or SELLER can create products. 
// Uses multer's .array() to accept up to 5 images.
router.post(
    "/", 
    verifyJWT, 
    authorizeRoles('ADMIN', 'SELLER'), 
    upload.array('images', 5), 
    createProduct
);

export default router;
