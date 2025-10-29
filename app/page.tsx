import Link from 'next/link';

export default function Home() {
  return (
    <div className="wrapper wrapper--center min-h-[calc(100vh-4rem)]">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Browse our collection of products, add your favorites, and create your own products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Browse Products
          </Link>
          <Link
            href="/create-product"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg font-medium"
          >
            Create Product
          </Link>
        </div>
        
      </div>
    </div>
  );
}
