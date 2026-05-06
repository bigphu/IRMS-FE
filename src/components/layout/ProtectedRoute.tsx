import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Role } from "@/types";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) 
    return <div>Loading...</div>;

  if (!isAuthenticated || !user) 
    return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) 
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;