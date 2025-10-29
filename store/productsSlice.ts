import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from '@/types/product';

const ITEMS_PER_PAGE = 12;

// Async thunk to fetch products from API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    return data.products as Product[];
  }
);

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  filter: 'all',
  searchQuery: '',
  categoryFilter: 'all',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const product = state.products.find(p => p.id === action.payload);
      if (product) {
        product.isLiked = !product.isLiked;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const newProduct: Product = {
        ...action.payload,
        id: Date.now(), // Generate unique ID
        isUserCreated: true,
        isLiked: false,
      };
      state.products.unshift(newProduct);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'favorites'>) => {
      state.filter = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map(p => ({ ...p, isLiked: false }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const {
  toggleLike,
  deleteProduct,
  addProduct,
  updateProduct,
  setFilter,
  setSearchQuery,
  setCategoryFilter,
  setCurrentPage,
} = productsSlice.actions;

export default productsSlice.reducer;
