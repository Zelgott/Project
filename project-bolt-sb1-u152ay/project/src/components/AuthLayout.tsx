import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}