import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../lib/auth';
import { createOrder } from '../lib/db';
import { products } from '../lib/products';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const { cartItems, subtotal, shipping, total } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user || !cartItems) return;

    const order = {
      userId: user.id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: products.find(p => p.id === item.productId)?.price || 0,
      })),
      total,
      shippingAddress: {
        fullName: data.fullName,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
      paymentMethod: {
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      },
      status: 'completed' as const,
    };

    const orderId = await createOrder(order);
    if (orderId) {
      navigate('/order-confirmation', { state: { orderId } });
    }
  };

  if (!cartItems || !total) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{product.name} x {item.quantity}</span>
                  <span>${(product.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    {...register('address')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      {...register('city')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      {...register('state')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      {...register('zipCode')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      {...register('country')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    {...register('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      {...register('expiryDate')}
                      placeholder="MM/YY"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      {...register('cvv')}
                      placeholder="123"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}