'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const banners = [
    {
        id: 1,
        title: "FLAT 50% OFF",
        subtitle: "ON TOP FASHION BRANDS",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600",
        link: "/products?category=Fashion",
        buttonText: "SHOP NOW"
    },
    {
        id: 2,
        title: "LATEST ELECTRONICS",
        subtitle: "UP TO 30% OFF ON PREMIUM GADGETS",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1600",
        link: "/products?category=Electronics",
        buttonText: "EXPLORE"
    },
    {
        id: 3,
        title: "BEAUTY ESSENTIALS",
        subtitle: "GET THE GLOW WITH OUR CURATED SETS",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600",
        link: "/products?category=Beauty",
        buttonText: "GRAB NOW"
    }
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <img 
                        src={banner.image} 
                        alt={banner.title}
                        className="w-full h-full object-cover transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4 sm:px-12 md:px-24">
                        <div className={`max-w-xl transition-all duration-1000 transform ${
                            index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            <h3 className="text-indigo-400 font-bold tracking-[0.3em] mb-4 text-sm md:text-base">
                                {banner.subtitle}
                            </h3>
                            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
                                {banner.title}
                            </h2>
                            <Link
                                href={banner.link}
                                className="inline-block px-10 py-4 bg-white text-gray-900 font-black rounded-sm hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
                            >
                                {banner.buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                        }`}
                    />
                ))}
            </div>

            {/* Side Controls */}
            <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors"
            >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors"
            >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </section>
    );
}
