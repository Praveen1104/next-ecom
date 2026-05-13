'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationData } from '../utils/navigationData';
import { useAuthStore } from '../lib/store/useAuthStore';

export default function Header() {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center pr-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-3xl font-black tracking-tighter text-indigo-600 italic">
                                PYNTRA
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex h-full items-center">
                        {navigationData.map((menu) => (
                            <div
                                key={menu.name}
                                className="h-full group"
                                onMouseEnter={() => setHoveredMenu(menu.name)}
                                onMouseLeave={() => setHoveredMenu(null)}
                            >
                                <Link 
                                    href={menu.href} 
                                    className={`flex items-center h-full px-5 text-sm font-bold tracking-widest uppercase transition-all border-b-4 ${
                                        hoveredMenu === menu.name 
                                        ? 'text-indigo-600 border-indigo-600' 
                                        : 'text-gray-800 dark:text-gray-200 border-transparent hover:border-indigo-600/30'
                                    }`}
                                >
                                    {menu.name}
                                </Link>
                            </div>
                        ))}

                        {/* Role Based Links */}
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link href="/admin" className="flex items-center h-full px-5 text-sm font-bold tracking-widest uppercase text-red-600 border-b-4 border-transparent hover:border-red-600 transition-all">
                                Admin Panel
                            </Link>
                        )}
                        {isAuthenticated && user?.role === 'SELLER' && (
                            <Link href="/seller" className="flex items-center h-full px-5 text-sm font-bold tracking-widest uppercase text-green-600 border-b-4 border-transparent hover:border-green-600 transition-all">
                                Seller Portal
                            </Link>
                        )}
                    </nav>

                    {/* Search & Actions */}
                    <div className="flex-1 flex items-center justify-end space-x-8 pl-8">
                        <div className="hidden xl:block flex-1 max-w-md">
                            <form onSubmit={handleSearch} className="relative group">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products, brands and more" 
                                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-none rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all placeholder:text-gray-400"
                                />
                                <button type="submit" className="absolute left-4 top-3 h-4.5 w-4.5 text-gray-400 group-focus-within:text-indigo-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                            <Link href={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center cursor-pointer group">
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600">
                                    {isAuthenticated ? (user?.firstName || 'Profile') : 'Login'}
                                </span>
                            </Link>
                            {isAuthenticated && (
                                <button onClick={logout} className="flex flex-col items-center cursor-pointer group">
                                    <svg className="w-5 h-5 text-gray-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-gray-500 group-hover:text-red-600">Logout</span>
                                </button>
                            )}
                            <div className="flex flex-col items-center cursor-pointer group">
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600">Wishlist</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer group relative">
                                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600">Bag</span>
                                <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Megamenu Overlay */}
            <AnimatePresence>
                {hoveredMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 left-0 w-full bg-white dark:bg-gray-950 shadow-2xl border-t border-gray-100 dark:border-gray-800 z-40 overflow-hidden"
                        onMouseEnter={() => setHoveredMenu(hoveredMenu)}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-5 gap-10">
                            {navigationData.find(m => m.name === hoveredMenu)?.sections.map((section, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-gray-50 dark:border-gray-900 pb-2">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-2">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx}>
                                                <Link 
                                                    href={`/products?category=${item}`}
                                                    className="text-[13px] text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block leading-relaxed"
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            
                            {/* Featured Banner in Menu */}
                            <div className="col-span-1 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">New Arrival</span>
                                    <h5 className="text-lg font-black text-gray-900 dark:text-white mt-2 leading-tight">THE SEASON'S BEST SELECTION</h5>
                                </div>
                                <Link 
                                    href="/products"
                                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    SHOP COLLECTION →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
