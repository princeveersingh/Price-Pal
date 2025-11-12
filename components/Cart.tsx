import React from 'react';
import type { CartItemData } from '../types';
import CartItem from './CartItem';

interface CartProps {
  items: CartItemData[];
  onRemoveItem: (id: string) => void;
  onRetry: (id: string, name: string) => void;
  onSetPriceAlert: (id: string, price: number) => void;
  onRemovePriceAlert: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onRetry, onSetPriceAlert, onRemovePriceAlert }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400 animate-bobble" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h3 className="mt-2 text-xl font-medium text-slate-900 dark:text-white">Your comparison cart is empty</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Add a product above to start comparing prices!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Comparison Results</h2>
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={onRemoveItem}
          onRetry={onRetry}
          onSetPriceAlert={onSetPriceAlert}
          onRemovePriceAlert={onRemovePriceAlert}
        />
      ))}
    </div>
  );
};

export default Cart;