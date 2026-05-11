import { configureStore, type Middleware, isAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const cartPersistenceMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  // Let the action pass through to the reducers first so the state updates
  const result = next(action);

  // Check if the action that just fired belongs to the "cart" slice
  if (isAction(action) && action.type.startsWith("cart/")) {
    const currentCartState = storeAPI.getState().cart;
    localStorage.setItem("irms_cart", JSON.stringify(currentCartState));
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;