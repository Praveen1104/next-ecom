'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { fetchMyProducts } from '../../lib/api'; // I'll need to add this
import { useAuthStore } from '../../lib/store/useAuthStore';
import Link from 'next/link';

export default function SellerDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchMyProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load seller products", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
            <div className="bg-gray-50 dark:bg-gray-950 min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Seller Dashboard</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Welcome back, {user?.firstName}!</p>
                        </div>
                        <Link 
                            href="/seller/add-product"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            + Add New Product
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Products</span>
                            <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{products.length}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Orders</span>
                            <p className="text-3xl font-black text-green-600 mt-2">0</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Earnings</span>
                            <p className="text-3xl font-black text-indigo-600 mt-2">₹0</p>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Inventory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {loading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-6"><div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div></td>
                                                <td className="px-6 py-6"><div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div></td>
                                                <td className="px-6 py-6"><div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div></td>
                                                <td className="px-6 py-6"><div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded"></div></td>
                                                <td className="px-6 py-6"><div className="h-4 w-10 bg-gray-100 dark:bg-gray-800 rounded"></div></td>
                                            </tr>
                                        ))
                                    ) : products.length > 0 ? (
                                        products.map(product => (
                                            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center space-x-4">
                                                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-lg object-cover" />
                                                        <span className="font-bold text-gray-900 dark:text-white">{product.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                                                <td className="px-6 py-5 font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-400">{product.stock}</td>
                                                <td className="px-6 py-5">
                                                    <button className="text-indigo-600 font-bold text-sm hover:underline">Edit</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                                                You haven't added any products yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
