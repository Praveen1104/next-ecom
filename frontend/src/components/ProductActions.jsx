'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useCartStore } from '../lib/store/useCartStore';
import { useWishlistStore } from '../lib/store/useWishlistStore';
import toast from 'react-hot-toast';

export default function ProductActions({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const availableSizes = product.variants
    ? [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size))]
    : [];

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addItem({
      ...product,
      selectedColor,
      selectedSize,
    });
    toast.success('Added to cart!');
  };

  const isWishlisted = isInWishlist(product._id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Saved to wishlist');
    }
  };

  return (
    <div className="space-y-8">
      {/* Color Selection */}
      {product.variants?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">Color</h3>
          <div className="mt-4 flex items-center space-x-3">
            {[...new Set(product.variants.map(v => v.color))].map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize(''); // Reset size when color changes
                }}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedColor === color
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {selectedColor && availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">Size</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Size Guide</button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                  selectedSize === size
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-200 dark:shadow-none"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Add to Bag</span>
        </button>
        
        <button
          onClick={toggleWishlist}
          className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-bold text-lg border transition-all hover:scale-[1.02] ${
            isWishlisted
              ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900/30'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <span>100% Original Products</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Check className="w-4 h-4 text-blue-600" />
          </div>
          <span>Easy 15 Days Returns</span>
        </div>
      </div>
    </div>
  );
}
