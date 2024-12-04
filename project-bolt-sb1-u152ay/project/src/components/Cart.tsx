import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';
import { getCartItems } from '../lib/db';
import { products } from '../lib/products';
import { CartItem } from './CartItem';

export function Cart() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCartItems = async () => {
    if (!user) return;
    const items = await getCartItems(user.id);
    setCartItems(items);
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cart = document.getElementById('shopping-cart');
      if (cart && !cart.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = 10.00;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout', { 
      state: { 
        cartItems,
        subtotal,
        shipping,
        total
      } 
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700"
      >
        <ShoppingBag className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="shopping-cart"
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-auto"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <div className="mt-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <CartItem
                        key={item.id}
                        item={item}
                        product={product}
                        onUpdate={fetchCartItems}
                      />
                    );
                  })}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-gray-900">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}