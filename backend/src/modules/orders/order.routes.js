import { Router } from 'express';
import { 
    createOrder, 
    getOrderById, 
    getMyOrders, 
    updateOrderToPaid, 
    updateOrderToDelivered 
} from './order.controller.js';
import { verifyJWT, authorizeRoles } from '../../middlewares/auth.middleware.js';

const router = Router();

// Protect all order routes
router.use(verifyJWT);

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);

// Payment update
router.put("/:id/pay", updateOrderToPaid);

// Admin only routes
router.put("/:id/deliver", authorizeRoles('ADMIN'), updateOrderToDelivered);

export default router;
