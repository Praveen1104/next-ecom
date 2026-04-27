import Link from "next/link";
import CategoryCard from "../components/CategoryCard";

const trendingCategories = [
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400', count: '1,200+' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400', count: '850+' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400', count: '430+' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400', count: '290+' },
];

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 font-sans">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441997641577-45934dd0ee81?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-30 dark:opacity-20"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-950/50 dark:to-gray-950"></div>
        </div>

        <main className="relative z-10 mx-auto max-w-4xl text-center px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
            Upgrade Your <span className="text-indigo-600">Lifestyle</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
            Discover a curated collection of fashion, electronics, and essentials. 
            Experience the best of e-commerce with a premium touch.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Shop Collection
            </Link>
            <Link
              href="/signup"
              className="px-10 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-bold text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Join the Community
            </Link>
          </div>
        </main>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Explore our most popular departments</p>
          </div>
          <Link href="/products" className="text-indigo-600 font-semibold hover:underline">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCategories.map((cat) => (
            <CategoryCard key={cat.name} category={cat.name} image={cat.image} count={cat.count} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Want to sell your products?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of vendors and start your business journey with our easy-to-use admin dashboard.
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            Become a Seller
          </Link>
        </div>
      </section>
    </div>
  );
}
