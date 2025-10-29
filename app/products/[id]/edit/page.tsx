'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProduct } from '@/store/productsSlice';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = Number(params.id);

  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId)
  );

  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    category: product?.category || '',
    thumbnail: product?.thumbnail || '',
    brand: product?.brand || '',
    stock: product?.stock?.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Image URL is required';
    } else if (!isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const updatedProduct = {
      ...product,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      thumbnail: formData.thumbnail,
      brand: formData.brand || undefined,
      stock: formData.stock ? Number(formData.stock) : undefined,
    };

    dispatch(updateProduct(updatedProduct));
    router.push(`/products/${product.id}`);
  };

  const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ];

  return (
    <div className="wrapper wrapper--narrow py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Product Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.title
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-800 dark:border-gray-600`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-800 dark:border-gray-600`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.price
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-2">
              Stock (optional)
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              } dark:bg-gray-800 dark:border-gray-600`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-2">
              Brand (optional)
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium mb-2">
            Image URL *
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.thumbnail
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-800 dark:border-gray-600`}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
          )}
          {formData.thumbnail && isValidUrl(formData.thumbnail) && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => router.push(`/products/${product.id}`)}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
