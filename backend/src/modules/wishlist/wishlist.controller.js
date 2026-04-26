import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Wishlist } from './wishlist.model.js';

/**
 * @route GET /api/v1/wishlist
 * @desc Get user wishlist
 * @access Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
        'products',
        'title price images brand stock'
    );

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

/**
 * @route POST /api/v1/wishlist/toggle
 * @desc Add or remove item from wishlist
 * @access Private
 */
export const toggleWishlistItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        // Create new wishlist with item
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId]
        });
        return res.status(200).json(new ApiResponse(200, wishlist, "Item added to wishlist"));
    }

    // Wishlist exists, check if product is in it
    const isItemInWishlist = wishlist.products.includes(productId);

    if (isItemInWishlist) {
        // Remove item
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    } else {
        // Add item
        wishlist.products.push(productId);
    }

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate(
        'products',
        'title price images brand stock'
    );

    res.status(200).json(
        new ApiResponse(
            200, 
            updatedWishlist, 
            isItemInWishlist ? "Item removed from wishlist" : "Item added to wishlist"
        )
    );
});
