import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  if (!orderId) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order number is #{orderId}.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}