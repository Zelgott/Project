import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '../lib/products';
import { useAuthStore } from '../lib/auth';
import { addToCart } from '../lib/db';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const user = useAuthStore((state) => state.user);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!user) return;
    setIsAdding(true);
    const success = await addToCart(user.id, product.id, 1);
    setIsAdding(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-gray-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || showSuccess}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              showSuccess 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:opacity-50 transition-colors duration-200`}
          >
            {showSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}