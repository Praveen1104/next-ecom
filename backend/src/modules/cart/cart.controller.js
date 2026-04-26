import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Cart } from './cart.model.js';

/**
 * @route GET /api/v1/cart
 * @desc Get user cart
 * @access Private
 */
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'title price images brand stock'
    });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

/**
 * @route POST /api/v1/cart/add
 * @desc Add item to cart
 * @access Private
 */
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // Create new cart
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        });
    } else {
        // Cart exists, check if product already in cart
        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Product does not exist in cart, add new item
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'title price images brand stock'
    });

    res.status(200).json(new ApiResponse(200, updatedCart, "Item added to cart"));
});

/**
 * @route PUT /api/v1/cart/update
 * @desc Update item quantity in cart
 * @access Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
    } else {
        throw new ApiError(404, "Item not found in cart");
    }

    const updatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'title price images brand stock'
    });

    res.status(200).json(new ApiResponse(200, updatedCart, "Cart item updated"));
});

/**
 * @route DELETE /api/v1/cart/remove/:productId
 * @desc Remove item from cart
 * @access Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

/**
 * @route DELETE /api/v1/cart/clear
 * @desc Clear user cart
 * @access Private
 */
export const clearCart = asyncHandler(async (req, res) => {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(200).json(new ApiResponse(200, null, "Cart cleared successfully"));
});
