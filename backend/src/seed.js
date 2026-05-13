import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './modules/products/product.model.js';
import { User } from './modules/users/user.model.js';
import bcrypt from 'bcrypt';

dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // 1. Create a Seller
        const hashedPassword = await bcrypt.hash('password123', 10);
        const seller = await User.findOneAndUpdate(
            { email: 'seller@pyntra.com' },
            {
                firstName: 'Sneha',
                lastName: 'Fashion',
                email: 'seller@pyntra.com',
                password: hashedPassword,
                role: 'SELLER',
                isEmailVerified: true
            },
            { upsert: true, new: true }
        );

        // 2. Create sample products
        const products = [
            {
                title: 'Premium Linen Summer Shirt',
                description: 'Breathable linen shirt perfect for summer outings.',
                price: 1299,
                category: 'Fashion',
                brand: 'Zara',
                stock: 50,
                seller: seller._id,
                images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400' }]
            },
            {
                title: 'Noise Cancelling Wireless Headphones',
                description: 'Studio quality sound with 40h battery life.',
                price: 4999,
                category: 'Electronics',
                brand: 'Sony',
                stock: 20,
                seller: seller._id,
                images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' }]
            }
        ];

        await Product.deleteMany({ seller: seller._id });
        await Product.insertMany(products);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
