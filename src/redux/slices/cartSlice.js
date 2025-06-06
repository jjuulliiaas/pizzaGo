import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
  const data = localStorage.getItem('cart');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return { items: [], totalPrice: 0 };
    }
  }
  return { items: [], totalPrice: 0 };
};

const initialState = getCartFromStorage();

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({ items: state.items, totalPrice: state.totalPrice }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
      saveCartToStorage(state);
    },
    minusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload);

      if (findItem) {
        findItem.count--;
        if (findItem.count === 0) {
          state.items = state.items.filter((obj) => obj.id !== action.payload);
        }
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
      saveCartToStorage(state);
    },
    removeItem(state, action) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addItem, removeItem, minusItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 