import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import KDSPage from './pages/KDSPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute allowedRoles={['SERVER', 'ADMIN']} />}>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['CHEF', 'MANAGER']} />}>
              <Route path="/kds" element={<KDSPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}