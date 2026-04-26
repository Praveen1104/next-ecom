import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxLength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxLength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Do not return password by default
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SELLER'],
        default: 'USER'
    },
    avatar: {
        type: String, // cloudinary url
        default: 'https://res.cloudinary.com/demo/image/upload/v1525287693/user-default.png'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Pre-save hook to hash password before saving to DB
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    
    // Hash password with cost of 10
    this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to check password validity
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Instance method to generate JWT Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY || '1d'
        }
    );
};

// Instance method to generate JWT Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d'
        }
    );
};

export const User = mongoose.model('User', userSchema);
