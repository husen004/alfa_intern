export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
  isLiked?: boolean;
  isUserCreated?: boolean;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  filter: 'all' | 'favorites';
  searchQuery: string;
  categoryFilter: string;
}
