import { Router } from 'express';
import { handleBatchRequest } from './batch.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Batch endpoint is secured to prevent abuse
router.post("/", verifyJWT, handleBatchRequest);

export default router;
