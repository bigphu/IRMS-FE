import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/contexts/AuthProvider";
import MenuProvider from "@/contexts/MenuProvider";
import CartProvider from "@/contexts/CartProvider";
import { ProtectedRoute } from "@/components";

// Pages
import LoginPage from "@/features/auth/LoginPage";
import MenuPage from "@/features/menu/MenuPage";
import KDSPage from "@/features/kds/KDSPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<div>Access Denied</div>} />

              <Route element={<ProtectedRoute />}>
                <Route path="/menu" element={<MenuPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["CHEF", "MANAGER"]} />}>
                <Route path="/kds" element={<KDSPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;