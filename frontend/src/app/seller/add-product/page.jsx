'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { addProduct } from '../../../lib/api';
import Link from 'next/link';

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        compareAtPrice: '',
        category: 'Fashion',
        brand: '',
        stock: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            images.forEach(image => data.append('images', image));

            await addProduct(data);
            router.push('/seller'); // Redirect back to dashboard
        } catch (err) {
            setError(err.message || 'Something went wrong while adding the product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
            <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <nav className="mb-8">
                        <Link href="/seller" className="text-sm font-bold text-indigo-600 hover:underline">
                            ← Back to Dashboard
                        </Link>
                    </nav>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl p-8 sm:p-12">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-8">
                            Add New Product
                        </h1>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Slim Fit Denim Jacket"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Description</label>
                                <textarea
                                    required
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product in detail..."
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Price (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="1299"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                    />
                                </div>
                                {/* Stock */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inventory Stock</label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="50"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-gray-700 dark:text-gray-200"
                                    >
                                        <option value="Fashion">Fashion</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Beauty">Beauty</option>
                                        <option value="Home & Garden">Home & Garden</option>
                                    </select>
                                </div>
                                {/* Brand */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Brand</label>
                                    <input
                                        required
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="Zara"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Images (Max 5)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 dark:border-gray-800 border-dashed rounded-3xl hover:border-indigo-600/30 transition-all group">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-600 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            <label className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-bold text-indigo-600 hover:text-indigo-500">
                                                <span>Upload files</span>
                                                <input type="file" multiple onChange={handleImageChange} className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                                {images.length > 0 && (
                                    <p className="mt-2 text-xs font-bold text-indigo-600">{images.length} images selected</p>
                                )}
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-5 px-6 rounded-2xl text-white font-black text-lg transition-all shadow-xl ${
                                        loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] shadow-indigo-200 dark:shadow-none'
                                    }`}
                                >
                                    {loading ? 'Adding Product...' : 'List Product to Catalog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
