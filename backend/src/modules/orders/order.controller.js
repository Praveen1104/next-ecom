import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Order } from './order.model.js';

/**
 * @route POST /api/v1/orders
 * @desc Create new order
 * @access Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        throw new ApiError(400, "No order items");
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    });

    const createdOrder = await order.save();

    res.status(201).json(new ApiResponse(201, createdOrder, "Order created successfully"));
});

/**
 * @route GET /api/v1/orders/:id
 * @desc Get order by ID
 * @access Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Ensure the user requesting the order is the one who placed it, or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        throw new ApiError(403, "Not authorized to view this order");
    }

    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

/**
 * @route GET /api/v1/orders/myorders
 * @desc Get logged in user orders
 * @access Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

/**
 * @route PUT /api/v1/orders/:id/pay
 * @desc Update order to paid
 * @access Private
 */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order marked as paid"));
});

/**
 * @route PUT /api/v1/orders/:id/deliver
 * @desc Update order to delivered
 * @access Private/Admin
 */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'Delivered';

    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse(200, updatedOrder, "Order marked as delivered"));
});
