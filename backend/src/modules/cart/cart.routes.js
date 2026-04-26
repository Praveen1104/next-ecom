import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from './cart.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all cart routes
router.use(verifyJWT);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
