import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { User } from './user.model.js';
import { uploadOnCloudinary } from '../../utils/cloudinary.js';
import { sendEmail } from '../../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

/**
 * Helper function to generate and save both tokens
 */
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

/**
 * Configure cookie options
 */
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day for access token (cookie might be overridden)
};

/**
 * @route POST /api/v1/users/register
 * @desc Register a new user
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
    // req.body is already validated by Zod at this point
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with email already exists");
    }

    // Handle avatar upload if provided
    let avatarUrl = undefined;
    if (req.file) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (uploadResult) {
            avatarUrl = uploadResult.url;
        }
    }

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        avatar: avatarUrl
    });

    // Remove password from response
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Send Welcome Email asynchronously
    const message = `
        <h1>Welcome to Myntra Clone, ${firstName}!</h1>
        <p>We are thrilled to have you on board.</p>
    `;
    
    // We do not await this so it doesn't slow down the response
    sendEmail({
        email: user.email,
        subject: "Welcome to Myntra Clone!",
        message
    });

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

/**
 * @route POST /api/v1/users/login
 * @desc Authenticate user & get token
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password"); // Need password for comparison

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }) // 10 days
        .json(
            new ApiResponse(
                200, 
                { user: loggedInUser, accessToken, refreshToken }, 
                "User logged in successfully"
            )
        );
});

/**
 * @route POST /api/v1/users/logout
 * @desc Logout user
 * @access Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, // remove token from db
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * @route POST /api/v1/users/refresh-token
 * @desc Refresh access token using refresh token
 * @access Public (but requires refresh token)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

/**
 * @route GET /api/v1/users/profile
 * @desc Get user profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is attached by verifyJWT middleware
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});
