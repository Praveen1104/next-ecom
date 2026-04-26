import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gray-50 px-4 font-sans dark:bg-gray-900 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Welcome to <span className="text-indigo-600">Myntra Clone</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Discover the latest trends in fashion. Fast, reliable, and beautifully designed.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/products"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
            >
              Shop Now
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 md:py-4 md:px-10 md:text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
