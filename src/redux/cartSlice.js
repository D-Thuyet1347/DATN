import { createSlice } from "@reduxjs/toolkit";

// Trạng thái giỏ hàng ban đầu
const initialState = {
  cartData: {},
  loading: false,
  error: null,
};

// Slice giỏ hàng
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      setLoading: (state) => {
        state.loading = true;
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      },
      setCartData: (state, action) => {
        state.cartData = action.payload;
        state.loading = false;
      },
      addToCartItem: (state, action) => {
        const { productId, quantity, productDetails } = action.payload;
        
        if (state.cartData[productId]) {
          state.cartData[productId].quantity += quantity;
        } else {
          state.cartData[productId] = {
            ...productDetails,
            quantity: quantity,
          };
        }
      },
      decreaseFromCartItem: (state, action) => {
        const itemId = action.payload;
        if (state.cartData[itemId] && state.cartData[itemId].quantity > 0) {
          state.cartData[itemId].quantity -= 1;
        }
      },
      removeFromCartItem: (state, action) => {
        const itemId = action.payload;
        delete state.cartData[itemId];
      },
      clearCart: (state) => {
        state.cartData = {};
      },
    },
  });
  

export const {
  setLoading,
  setError,
  setCartData,
  addToCartItem,
  decreaseFromCartItem,
  removeFromCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
