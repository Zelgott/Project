import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { CheckoutPage } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { AuthLayout } from './components/AuthLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;