import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types';

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to={currentUser.role === 'CHEF' ? '/kds' : '/menu'} replace />;
  return <Outlet />;
}