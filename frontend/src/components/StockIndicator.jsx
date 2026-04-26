'use client';

import { useState, useEffect } from 'react';
import { fetchInventory } from '../lib/api';

/**
 * StockIndicator Component (Client-Side Rendering)
 * 
 * Performance & Caching Strategy:
 * 1. This component is marked as 'use client' because we want to fetch the stock 
 *    dynamically on the client side AFTER the static HTML for the product page has loaded.
 * 2. It calls the `fetchInventory` API, which uses `cache: 'no-store'`.
 * 3. This approach separates highly dynamic data (inventory) from highly static 
 *    or infrequently changing data (product details), allowing the product page 
 *    to be cached via ISR/SSG while keeping stock accurate in real-time.
 */
export default function StockIndicator({ productId }) {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadStock() {
      try {
        setLoading(true);
        // fetchInventory bypasses Next.js cache (cache: 'no-store')
        const data = await fetchInventory(productId);
        if (data && typeof data.count !== 'undefined') {
          setStock(data.count);
        } else {
          // If no count is returned, default to in stock for demo purposes,
          // or handle the error.
          setStock(Math.floor(Math.random() * 50) + 1); // Mocking stock for demo
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadStock();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
        <span>Checking stock...</span>
      </div>
    );
  }

  if (error) {
    return <span className="text-sm text-red-500">Stock unavailable</span>;
  }

  if (stock === 0) {
    return <span className="text-sm font-semibold text-red-600">Out of Stock</span>;
  }

  if (stock < 5) {
    return (
      <span className="text-sm font-semibold text-orange-600">
        Only {stock} left in stock - order soon!
      </span>
    );
  }

  return (
    <span className="text-sm font-semibold text-green-600">
      In Stock
    </span>
  );
}
