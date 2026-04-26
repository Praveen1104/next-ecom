import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, refreshAccessToken } from './user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './user.validation.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public Routes
router.post(
    "/register",
    upload.single("avatar"), // Handle file upload before validation just in case
    validate(registerSchema), 
    registerUser
);

router.post(
    "/login", 
    validate(loginSchema), 
    loginUser
);

router.post("/refresh-token", refreshAccessToken);

// Secured Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getUserProfile);

export default router;
