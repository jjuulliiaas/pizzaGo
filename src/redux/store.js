import { configureStore } from '@reduxjs/toolkit';
import filter from './slices/filterSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    filter,
    cart: cartReducer,
  },
});
