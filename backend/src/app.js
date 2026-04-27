import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { appendRequestId } from './middlewares/requestId.js';

const app = express();


// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);
// ==========================================
// 1. SECURITY & UTILITY MIDDLEWARES
// ==========================================

// Cross-Origin Resource Sharing setup
app.use(cors({
    origin: true,
    credentials: true
}));

// Helmet helps secure Express apps by setting various HTTP headers (e.g., XSS Protection, NoSniff).
app.use(helmet());

// Apply Rate Limiting to all requests
app.use(apiRateLimiter);

// Append a unique ID to every request for tracing
app.use(appendRequestId);

// ==========================================
// 2. PARSING MIDDLEWARES
// ==========================================

// Parse incoming JSON payloads with a limit
app.use(express.json({ limit: '16kb' }));

// Parse incoming URL-encoded payloads (e.g., form submissions)
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Parse cookies
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// ==========================================
// 3. LOGGING MIDDLEWARE
// ==========================================

// Morgan request logger. Customized to include the unique Request ID.
morgan.token('id', function getId(req) {
    return req.id;
});

// Define a custom format: [Request ID] Method URL Status ResponseTime ms
const morganFormat = '[:id] :method :url :status :response-time ms - :res[content-length]';
app.use(morgan(morganFormat));

// ==========================================
// 4. API DOCUMENTATION
// ==========================================
const swaggerDocument = YAML.load('./docs/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========================================
// 5. ROUTES
// ==========================================

// Healthcheck Route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        requestId: req.id
    });
});

// Import Routers
import userRouter from './modules/users/user.routes.js';
import productRouter from './modules/products/product.routes.js';
import orderRouter from './modules/orders/order.routes.js';
import cartRouter from './modules/cart/cart.routes.js';
import wishlistRouter from './modules/wishlist/wishlist.routes.js';
import paymentRouter from './modules/payments/payment.routes.js';

// Declare API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/payments', paymentRouter);

// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================
// This must be the very last middleware to catch all errors from routes.
app.use(errorHandler);

export { app };
