import Razorpay from 'razorpay';
import crypto from 'crypto';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Order } from '../orders/order.model.js';

// Initialize Razorpay
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new ApiError(500, "Razorpay keys not configured");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

/**
 * @route POST /api/v1/payments/create-order
 * @desc Create a Razorpay Order
 * @access Private
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    // Find the order in our DB
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to pay for this order");
    }

    const instance = getRazorpayInstance();

    // Amount should be in paise (smallest currency unit). Multiply INR by 100
    const options = {
        amount: Math.round(order.totalPrice * 100), 
        currency: "INR",
        receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
        throw new ApiError(500, "Some error occurred while creating Razorpay order");
    }

    res.status(200).json(
        new ApiResponse(200, razorpayOrder, "Razorpay order created successfully")
    );
});

/**
 * @route POST /api/v1/payments/verify
 * @desc Verify Razorpay Payment Signature
 * @access Private
 */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Create the signature that Razorpay expects
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError(400, "Invalid Payment Signature");
    }

    // Payment is valid, update our Order in DB
    const order = await Order.findById(orderId);
    
    if (!order) {
        throw new ApiError(404, "Order not found but payment was successful");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: razorpay_payment_id,
        status: "success",
        update_time: new Date().toISOString(),
        email_address: req.user.email
    };

    await order.save();

    res.status(200).json(
        new ApiResponse(200, { success: true }, "Payment verified successfully")
    );
});
