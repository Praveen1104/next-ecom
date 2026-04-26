import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProduct, fetchCatalog } from '../../../lib/api';
import StockIndicator from '../../../components/StockIndicator';

/**
 * generateStaticParams (SSG optimization)
 * This function tells Next.js to pre-render these specific product pages at build time.
 * For an e-commerce site, you would typically fetch the top 100 or 1000 most popular products
 * to pre-build them, ensuring instantaneous load times for your most important pages.
 */
export async function generateStaticParams() {
  const products = await fetchCatalog();
  // If the API is down or returns empty, we return an empty array
  if (!products || products.length === 0) return [];
  
  // Pre-render the first 50 products at build time
  return products.slice(0, 50).map((product) => ({
    id: String(product.id || product._id),
  }));
}

/**
 * Product Detail Page (PDP)
 * 
 * Rendering Strategy: SSG/ISR
 * - If the ID was returned by `generateStaticParams`, it's statically generated at build time (SSG).
 * - If not, it's generated on the first request and cached for future requests (ISR).
 * 
 * The `StockIndicator` component is rendered as a client component to fetch real-time
 * inventory without busting the cache for the entire page.
 */
export default async function ProductDetailPage({ params }) {
  // params is an async object in Next 15+ App Router, 
  // but depending on exact next version, it might need to be awaited.
  // Next 16 might require awaiting `params`.
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        
        {/* Image gallery */}
        <div className="relative aspect-square w-full rounded-2xl bg-gray-100 overflow-hidden shadow-md dark:bg-gray-800">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/800x800?text=No+Image'}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority // Preload the main product image for LCP optimization
          />
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ${product.price?.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700 dark:text-gray-300">
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            {/* Real-time stock indicator (Client Side) */}
            <StockIndicator productId={id} />
          </div>

          <div className="mt-10 flex">
            <button
              type="button"
              className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full transition-colors"
            >
              Add to bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
