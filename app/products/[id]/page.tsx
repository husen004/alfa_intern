'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleLike, deleteProduct } from '@/store/productsSlice';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = Number(params.id);
  
  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId)
  );

  const [selectedImage, setSelectedImage] = useState<string>(product?.thumbnail || '');

  if (!product) {
    return (
      <div className="wrapper py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link
            href="/products"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    dispatch(toggleLike(product.id));
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(product.id));
      router.push('/products');
    }
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.thumbnail];

  return (
    <div className="wrapper py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 ${
                    selectedImage === img
                      ? 'border-blue-600'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price}
            </span>
            {product.discountPercentage && (
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {product.brand && (
              <div>
                <h3 className="font-semibold text-gray-600">Brand</h3>
                <p>{product.brand}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-600">Category</h3>
              <p className="capitalize">{product.category}</p>
            </div>
            {product.stock !== undefined && (
              <div>
                <h3 className="font-semibold text-gray-600">Stock</h3>
                <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleLike}
              className={`flex-1 px-6 py-3 rounded-md transition-colors ${
                product.isLiked
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {product.isLiked ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Product
            </button>
          </div>

          {product.isUserCreated && (
            <div className="mt-4">
              <Link
                href={`/products/${product.id}/edit`}
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Product
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
