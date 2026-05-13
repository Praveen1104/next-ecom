import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Product } from './product.model.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { clearCachePattern } from '../../utils/cache.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';

/**
 * @route GET /api/v1/products
 * @desc Get all products with filtering, sorting, and pagination (Myntra-style listing)
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    // 1. Initialize API Features
    const features = new ApiFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // 2. Execute query
    const products = await features.query;

    // 3. Get total count for pagination (for the current filters)
    // Note: We need a fresh query object for countDocuments
    const filterObj = new ApiFeatures(Product.find(), req.query).filter().query.getFilter();
    const totalCount = await Product.countDocuments(filterObj);

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;

    const responseData = {
        products,
        pagination: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            limit
        }
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, "Products fetched successfully")
    );
});

/**
 * @route GET /api/v1/products/:id
 * @desc Get a single product by ID
 * @access Public
 */
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'firstName lastName avatar');

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

/**
 * @route POST /api/v1/products
 * @desc Create a new product (Seller or Admin)
 * @access Private/Role restricted
 */
export const createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        compareAtPrice,
        category,
        brand,
        stock,
        variants,
        specifications
    } = req.body;

    const product = await Product.create({
        title,
        description,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice) || 0,
        category,
        brand,
        stock: Number(stock),
        images,
        variants: typeof variants === 'string' ? JSON.parse(variants) : variants,
        specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications,
        seller: req.user._id // Taken from the verified JWT token
    });

    // Invalidate the products cache since the catalog has changed
    await clearCachePattern('products:*');

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});
