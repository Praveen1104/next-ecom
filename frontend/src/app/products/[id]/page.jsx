import { notFound } from 'next/navigation';
import { fetchProduct, fetchCatalog } from '../../../lib/api';
import ProductImageGallery from '../../../components/ProductImageGallery';
import ProductActions from '../../../components/ProductActions';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export async function generateStaticParams() {
  const products = await fetchCatalog();
  if (!products || products.length === 0) return [];
  return products.slice(0, 50).map((product) => ({
    id: String(product.id || product._id),
  }));
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <ol className="flex items-center space-x-2">
            <li>Home</li>
            <li>/</li>
            <li>{product.category}</li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductImageGallery images={product.images} />
          </div>

          {/* Right: Product Details */}
          <div className="mt-10 lg:mt-0 lg:col-span-5 flex flex-col">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center space-x-1 text-sm font-bold text-gray-900 dark:text-white">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.ratings?.average || 4.5}</span>
                  <span className="text-gray-400 font-normal">({product.ratings?.count || 120} Reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {product.title}
              </h1>
              
              <div className="mt-4 flex items-baseline space-x-4">
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  ${product.price}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.compareAtPrice}
                    </span>
                    <span className="text-xl font-bold text-orange-500">
                      ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-green-600 font-bold">inclusive of all taxes</p>
            </div>

            <div className="py-8 border-b border-gray-100 dark:border-gray-800">
              <ProductActions product={product} />
            </div>

            <div className="py-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Product Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.specifications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-xs text-gray-500 uppercase">{spec.name}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery & Services */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Delivery & Services</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Free delivery on orders above $50</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <span>15 days easy returns & exchange</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>Secure transactions & pay on delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
