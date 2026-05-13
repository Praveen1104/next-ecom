'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { fetchWishlist, fetchCart, fetchOrders } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        const loadProfileData = async () => {
            try {
                const [wishlistData, cartData, ordersData] = await Promise.all([
                    fetchWishlist(),
                    fetchCart(),
                    fetchOrders()
                ]);
                setWishlist(wishlistData?.products || []);
                setCart(cartData);
                setOrders(ordersData || []);
            } catch (err) {
                console.error("Error loading profile data", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-2">Please login to view profile</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Access your orders, wishlist and personal details by signing in to your account.</p>
                <Link href="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    Login Now
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', name: 'Overview', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'orders', name: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'wishlist', name: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { id: 'bag', name: 'My Bag', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Header / Cover */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
            
            <div className="max-w-6xl mx-auto px-4 -mt-16 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6 border border-gray-100 dark:border-gray-800">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-indigo-100 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-black text-indigo-600 uppercase">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-sm text-gray-500 font-bold tracking-widest uppercase mt-1">
                                    {user?.role}
                                </p>
                            </div>

                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                            activeTab === tab.id 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                        </svg>
                                        <span>{tab.name}</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all mt-4"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 min-h-[500px] border border-gray-100 dark:border-gray-800"
                            >
                                {activeTab === 'profile' && (
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Personal Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</span>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{user?.firstName} {user?.lastName}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</span>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{user?.email}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Account Created</span>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">May 2026</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preferred Language</span>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">English (IN)</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'orders' && (
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Order History</h3>
                                        {orders.length > 0 ? (
                                            <div className="space-y-4">
                                                {orders.map(order => (
                                                    <div key={order._id} className="border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">#{order._id.slice(-8)}</p>
                                                            <p className="font-bold text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                                            <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                                            order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {order.isDelivered ? 'Delivered' : 'In Transit'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium italic">You haven't placed any orders yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'wishlist' && (
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Your Wishlist</h3>
                                        {wishlist.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                {wishlist.map(product => (
                                                    <div key={product._id} className="group cursor-pointer">
                                                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3">
                                                            <img src={product.images?.[0]?.url} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{product.title}</h4>
                                                        <p className="text-indigo-600 font-black text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium italic">Your wishlist is empty.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'bag' && (
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Shopping Bag</h3>
                                        {cart?.items?.length > 0 ? (
                                            <div className="space-y-6">
                                                {cart.items.map(item => (
                                                    <div key={item.product._id} className="flex space-x-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                                                        <img src={item.product.images?.[0]?.url} className="w-20 h-24 object-cover rounded-xl shadow-md" />
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{item.product.title}</h4>
                                                            <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                                                            <p className="text-indigo-600 font-black mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="pt-4 flex justify-between items-center">
                                                    <span className="text-lg font-black text-gray-900 dark:text-white">Total Amount</span>
                                                    <span className="text-2xl font-black text-indigo-600">₹{cart.totalPrice.toLocaleString('en-IN')}</span>
                                                </div>
                                                <Link href="/checkout" className="block w-full py-4 bg-indigo-600 text-white text-center rounded-2xl font-black shadow-xl shadow-indigo-100 mt-6">
                                                    Proceed to Checkout
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 font-medium italic">Your bag is empty.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
