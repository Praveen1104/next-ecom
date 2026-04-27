import Link from 'next/link';

export default function CategoryCard({ category, image, count }) {
  return (
    <Link 
      href={`/products?category=${category}`}
      className="group relative block overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[4/5] hover:shadow-xl transition-all duration-300"
    >
      <img
        src={image || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400`}
        alt={category}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
          {category}
        </h3>
        {count && (
          <p className="text-sm text-gray-300 mt-1">
            {count} Products
          </p>
        )}
      </div>
    </Link>
  );
}
