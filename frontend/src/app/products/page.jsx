import { Suspense } from 'react';
import ProductCard from '../../components/ProductCard';
import { fetchCatalog } from '../../lib/api';
import Link from 'next/link';

const categories = [
  'All', 'Fashion', 'Electronics', 'Beauty', 'Sports', 'Home & Garden'
];

const brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Zara', 'H&M'];
const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow'];
const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: '$100 to $500', min: 100, max: 500 },
  { label: 'Over $500', min: 500, max: 10000 },
];

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  
  // Build query for API
  const fetchParams = {
    page: params.page || 1,
    limit: 12,
    category: params.category === 'All' ? undefined : params.category,
    brand: params.brand,
    color: params.color,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    search: params.search,
    sortType: params.sortType || 'newest'
  };

  const products = await fetchCatalog(fetchParams);

  const getQueryString = (newParams) => {
    const updated = { ...params, ...newParams };
    // Remove undefined/empty values
    Object.keys(updated).forEach(key => {
      if (updated[key] === undefined || updated[key] === '' || updated[key] === 'All') {
        delete updated[key];
      }
    });
    return new URLSearchParams(updated).toString();
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
            <div className="sticky top-24 space-y-10">
              {/* Category Filter */}
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Categories</h2>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?${getQueryString({ category: cat, page: 1 })}`}
                      className={`flex items-center space-x-3 group cursor-pointer transition-all ${
                        (params.category || 'All') === cat ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full transition-all ${
                        (params.category || 'All') === cat ? 'bg-indigo-600 scale-125' : 'bg-transparent border border-gray-300 group-hover:border-gray-500'
                      }`}></span>
                      <span className="text-sm">{cat}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Brands</h2>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/products?${getQueryString({ brand: params.brand === brand ? undefined : brand, page: 1 })}`}
                      className={`flex items-center space-x-3 group cursor-pointer transition-all ${
                        params.brand === brand ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={params.brand === brand}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-sm">{brand}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Colors</h2>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <Link
                      key={color}
                      href={`/products?${getQueryString({ color: params.color === color ? undefined : color, page: 1 })}`}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        params.color === color ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-100 dark:border-gray-800'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></Link>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Price</h2>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <Link
                      key={range.label}
                      href={`/products?${getQueryString({ minPrice: range.min, maxPrice: range.max, page: 1 })}`}
                      className={`flex items-center space-x-3 group cursor-pointer transition-all ${
                        params.minPrice == range.min && params.maxPrice == range.max ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        params.minPrice == range.min && params.maxPrice == range.max ? 'border-indigo-600' : 'border-gray-300'
                      }`}>
                        {params.minPrice == range.min && params.maxPrice == range.max && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                      </div>
                      <span className="text-sm">{range.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white capitalize">
                  {params.category || 'Our Collection'}
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Showing {products.length} stunning results
                </p>
              </div>
              
              <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort by</span>
                <select 
                  className="bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
                  defaultValue={params.sortType || 'newest'}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <Suspense fallback={<ProductListSkeleton />}>
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
                  <div className="max-w-xs mx-auto">
                    <p className="text-gray-400 text-lg font-bold mb-6">
                      We couldn't find any products matching your selection.
                    </p>
                    <Link 
                      href="/products" 
                      className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all"
                    >
                      Reset All Filters
                    </Link>
                  </div>
                </div>
              )}
            </Suspense>

            {/* Pagination UI would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] w-full rounded-[2rem] bg-gray-100 dark:bg-gray-900"></div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-gray-900"></div>
            <div className="h-6 w-3/4 rounded bg-gray-100 dark:bg-gray-900"></div>
            <div className="h-6 w-1/4 rounded bg-gray-100 dark:bg-gray-900"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
