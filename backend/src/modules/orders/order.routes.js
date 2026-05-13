import { Router } from 'express';
import { createOrder, getOrderById, getMyOrders, updateOrderToPaid, updateOrderToDelivered } from './order.controller.js';
import { verifyJWT, authorizeRoles, authorizeOwner } from '../../middlewares/auth.middleware.js';
import { cacheMiddleware } from '../../middlewares/cache.middleware.js';
import { idempotencyMiddleware } from '../../middlewares/idempotency.middleware.js';
import { Order } from './order.model.js';

const router = Router();

// Secured Routes (All require JWT)
router.use(verifyJWT);

router.post("/", idempotencyMiddleware, createOrder);
router.get("/myorders", cacheMiddleware(300), getMyOrders);
router.get("/:id", authorizeOwner(Order, 'user'), cacheMiddleware(600), getOrderById);

// Payment update
router.put("/:id/pay", updateOrderToPaid);

// Admin only routes
router.put("/:id/deliver", authorizeRoles('ADMIN'), updateOrderToDelivered);

export default router;
