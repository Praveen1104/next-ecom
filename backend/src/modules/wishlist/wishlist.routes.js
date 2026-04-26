import { Router } from 'express';
import { getWishlist, toggleWishlistItem } from './wishlist.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all wishlist routes
router.use(verifyJWT);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlistItem);

export default router;
