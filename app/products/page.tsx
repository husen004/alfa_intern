'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProducts,
  setFilter,
  setSearchQuery,
  setCategoryFilter,
  setCurrentPage,
} from '@/store/productsSlice';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const {
    products,
    loading,
    error,
    filter,
    searchQuery,
    categoryFilter,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort();

  const filteredProducts = products.filter((product: Product) => {

    if (filter === 'favorites' && !product.isLiked) return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="wrapper py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper py-8">
        <div className="text-red-600 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="wrapper py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(setFilter('all'))}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => dispatch(setFilter('favorites'))}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'favorites'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Favorites ({products.filter((p) => p.isLiked).length})
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 text-gray-600 dark:text-gray-400">
        Showing {paginatedProducts.length} of {filteredProducts.length} products
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
