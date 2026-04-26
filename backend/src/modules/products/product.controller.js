import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Product } from './product.model.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { getCache, setCache, clearCachePattern } from '../../utils/cache.js';

/**
 * @route GET /api/v1/products
 * @desc Get all products with filtering, sorting, and pagination (Myntra-style listing)
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    // 1. Destructure query parameters with defaults
    const { 
        page = 1, 
        limit = 10, 
        sortType = 'newest', 
        category,
        brand,
        minPrice,
        maxPrice,
        search
    } = req.query;

    // 2. Build the query object
    let query = {};

    // Text search
    if (search) {
        query.$text = { $search: search };
    }

    // Exact matches
    if (category) query.category = category;
    if (brand) query.brand = brand;

    // Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 3. Build the sort object
    let sortOptions = {};
    if (search) {
        sortOptions = { score: { $meta: 'textScore' } }; // Sort by relevance if searching
    } else {
        switch (sortType) {
            case 'price_asc': sortOptions = { price: 1 }; break;
            case 'price_desc': sortOptions = { price: -1 }; break;
            case 'rating': sortOptions = { 'ratings.average': -1 }; break;
            case 'newest':
            default: sortOptions = { createdAt: -1 }; break;
        }
    }

    // 4. Calculate pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Check Redis Cache first
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
        return res.status(200).json(
            new ApiResponse(200, cachedData, "Products fetched successfully from cache")
        );
    }

    // 5. Execute query with Mongoose
    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber);

    // 6. Get total count for frontend pagination
    const totalCount = await Product.countDocuments(query);

    const responseData = {
        products,
        pagination: {
            totalCount,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / limitNumber),
            limit: limitNumber
        }
    };

    // Save to Redis Cache (Time-based: 1 hour)
    await setCache(cacheKey, responseData, 3600);

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
    const { title, description, price, compareAtPrice, category, brand, stock } = req.body;

    // Handle multiple image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadResult = await uploadOnCloudinary(file.path);
            if (uploadResult) {
                images.push({
                    url: uploadResult.url,
                    public_id: uploadResult.public_id
                });
            }
        }
    }

    if (images.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    const product = await Product.create({
        title,
        description,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice) || 0,
        category,
        brand,
        stock: Number(stock),
        images,
        seller: req.user._id // Taken from the verified JWT token
    });

    // Invalidate the products cache since the catalog has changed
    await clearCachePattern('products:*');

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});
