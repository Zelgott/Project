import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { Product } from '../lib/products';
import { updateCartItem, removeFromCart } from '../lib/db';

interface CartItemProps {
  item: {
    id: number;
    quantity: number;
    productId: number;
  };
  product: Product;
  onUpdate: () => void;
}

export function CartItem({ item, product, onUpdate }: CartItemProps) {
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(item.id, newQuantity);
    onUpdate();
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
    onUpdate();
  };

  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-16 object-cover rounded"
      />
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={handleRemove}
        className="ml-4 p-2 text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}