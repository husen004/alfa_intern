'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { toggleLike, deleteProduct } from '@/store/productsSlice';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLike(product.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(product.id));
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isDummyCdnImage = product.thumbnail?.startsWith('https://cdn.dummyjson.com');
  
  const renderImage = () => {
    if (isDummyCdnImage) {
      return (
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      );
    }

    if (product.thumbnail && product.thumbnail.startsWith('http')) {
      return (
        <img
          src={product.thumbnail}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium">
        No image
      </div>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {renderImage()}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 flex-1">
          {truncateText(product.description)}
        </p>

        {/* Price and Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded capitalize">
            {product.category}
          </span>
        </div>

        {/* Rating (if available) */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={product.isLiked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-5 h-5 ${
                product.isLiked
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-gray-400 dark:text-gray-500'
              }`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.isLiked ? 'Liked' : 'Like'}
            </span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Delete product"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}