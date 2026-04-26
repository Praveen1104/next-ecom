import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        index: true // Indexed for text search
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
        type: Number,
        default: 0 // Optional, used for "discounted from" UI
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        index: true // Useful for filtering
    },
    brand: {
        type: String,
        required: [true, 'Product brand is required'],
        index: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            public_id: {
                type: String, // from cloudinary for deletion
                required: false
            }
        }
    ],
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: [0, 'Rating must be above 0'],
            max: [5, 'Rating must be below 5'],
        },
        count: {
            type: Number,
            default: 0
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

export const Product = mongoose.model('Product', productSchema);
