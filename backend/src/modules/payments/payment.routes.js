import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from './payment.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

export default router;
