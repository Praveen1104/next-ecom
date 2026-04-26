import { Suspense } from 'react';
import ProductCard from '../../components/ProductCard';
import { fetchCatalog } from '../../lib/api';

/**
 * Product Listing Page (PLP)
 * 
 * Rendering Strategy: ISR (Incremental Static Regeneration)
 * Performance:
 * 1. The `fetchCatalog` function caches the result for 1 hour (revalidate: 3600).
 * 2. Next.js statically generates this page and serves it from the cache.
 * 3. In the background, it regenerates the page after 1 hour when a new request comes in,
 *    ensuring the catalog stays relatively fresh without hitting the backend on every request.
 */
export default async function ProductsPage() {
  // Fetch data on the server. This is cached by Next.js.
  const products = await fetchCatalog();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 border-b border-gray-200 pb-5 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Our Products
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Browse our latest collection. Fast and statically generated!
        </p>
      </div>

      <Suspense fallback={<ProductListSkeleton />}>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Please check back later.</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}

// A simple skeleton loader for the suspense fallback
function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-4 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mt-2 h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  );
}
