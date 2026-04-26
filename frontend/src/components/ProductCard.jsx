import Image from 'next/image';
import Link from 'next/link';

/**
 * ProductCard Component
 * 
 * Performance Optimizations:
 * 1. next/image: Automatically optimizes images (WebP/AVIF format), 
 *    lazy loads them by default, and serves them from Next.js built-in Image Optimization API
 *    or a configured CDN. This ensures static assets are permanently cached efficiently.
 * 2. next/link: Prefetches the linked page in the background when it enters the viewport,
 *    enabling instant navigation for ISR/SSG pages like the Product Detail Page.
 */
export default function ProductCard({ product }) {
  // Provide fallbacks in case data is incomplete
  const { id, name, price, imageUrl, category } = product;

  return (
    <Link href={`/products/${id}`} className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-gray-800">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* 
          Using next/image for static asset optimization.
          'fill' makes the image responsive to the parent container.
          'sizes' provides hints to the browser for responsive loading.
        */}
        <Image
          src={imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={name || 'Product Image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {category || 'General'}
        </p>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1 dark:text-white">
          {name}
        </h3>
        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          ${price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
