import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/features/cart/contexts/CartProvider";
import MenuPage from "@/features/menu/MenuPage";
// import { CartPage } from "@/features/cart/CartPage";
import LoginPage  from "@/features/auth/LoginPage";
import KDSPage from "@/features/kds/KDSPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Menu Route */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/menu" element={<MenuPage />} />

          {/* Cart Route */}
          {/* <Route path="/cart" element={<CartPage />} /> */}

          <Route path="/kds" element={<KDSPage />} />

          {/* Fallback: Redirect any unknown URLs to the menu */}
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
