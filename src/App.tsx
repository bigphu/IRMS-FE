import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import { useAppSelector } from "./store/hooks";
import { LoginPage, MenuPage, CartPage, KdsPage } from "./features";
import { ProtectedRoute, WebSocketBackgroundSync } from "./components";

function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const routingElement = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={["SERVER", "CASHIER"]} />}>
        <Route path="/" element={<MenuPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/home" element={<MenuPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["SERVER", "CASHIER"]} />}>
        <Route path="/cart" element={<CartPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/kds" element={<KdsPage />} />
      </Route>
    </Routes>
  );

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-mono font-bold border-2 shadow-lg",
          success: { className: "bg-surface text-primary border-primary" },
          error: { className: "bg-danger/10 text-danger border-danger" },
        }}
      />

      {/* 1. The invisible background listener runs alongside the app */}
      {isAuthenticated && <WebSocketBackgroundSync />}

      {/* 2. The visual app renders instantly, never blocked by the WebSocket! */}
      {routingElement}
    </>
  );
}

export default App;
