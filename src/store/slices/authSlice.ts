import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/api";

export interface AuthState {
  user: User | null;
  role: User["role"] | null;
  isAuthenticated: boolean;
}

const loadUserFromStorage = (): User | null => {
  try {
    const serializedUser = localStorage.getItem("irms_user");
    if (serializedUser === null) return null;
    return JSON.parse(serializedUser) as User;
  } catch (e) {
    console.warn("Failed to parse user from localStorage", e);
    return null;
  }
};

const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  role: initialUser?.role || null,
  isAuthenticated: !!initialUser,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      
      localStorage.setItem("irms_user", JSON.stringify(action.payload.user));
    },
    
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem("irms_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;