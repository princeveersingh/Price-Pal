import React from 'react';
import type { CartItemData } from '../types';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import PriceAlert from './PriceAlert';

interface CartItemProps {
  item: CartItemData;
  onRemove: (id: string) => void;
  onRetry: (id: string, name: string) => void;
  onSetPriceAlert: (id: string, price: number) => void;
  onRemovePriceAlert: (id: string) => void;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg className={`w-4 h-4 ${filled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Rating: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Math.round(value)} />
            ))}
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{value.toFixed(1)}</span>
        </div>
    );
};

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onRetry, onSetPriceAlert, onRemovePriceAlert }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-slide-down-fade hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-primary dark:text-indigo-400 break-all">{item.name}</h3>
          <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {item.isLoading && <Loader />}
        {item.error && <ErrorMessage message={item.error} onRetry={() => onRetry(item.id, item.name)} />}
        
        {item.comparisons && (
          <>
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                           <span className="font-bold">Expert Opinion:</span> {item.comparisons.recommendation}
                        </p>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Retailer</th>
                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider text-right">Price</th>
                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Delivery</th>
                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {item.comparisons.comparisons.map((comp, index) => {
                    const priceDropped = item.priceAlert != null && comp.price <= item.priceAlert;
                    const isBestDeal = comp.retailer === item.comparisons?.bestRetailer;
                    
                    return (
                      <tr 
                        key={index} 
                        className={`border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 transition-colors animate-slide-in-up ${priceDropped ? 'bg-green-100 dark:bg-green-900/30' : ''} ${isBestDeal ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                        style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                      >
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                            <a href={comp.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                                {comp.retailer}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                {isBestDeal && <span className="text-xs text-yellow-800 bg-yellow-300 dark:text-yellow-200 dark:bg-yellow-800 rounded-full px-2 py-0.5 font-bold animate-pulse-deal">Best Deal</span>}
                            </a>
                        </td>
                        <td className={`p-3 text-right font-semibold transition-colors rounded-md ${priceDropped ? 'text-green-600 dark:text-green-400 animate-highlight-flash' : 'text-secondary'}`}>
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(comp.price)}
                          {priceDropped && <span className="ml-2 text-xs text-white bg-green-500 rounded-full px-2 py-0.5 animate-pulse-fast">Alert!</span>}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{comp.deliveryDate}</td>
                        <td className="p-3"><Rating value={comp.rating} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!item.isLoading && (
            <PriceAlert
                currentAlert={item.priceAlert}
                onSetAlert={(price) => onSetPriceAlert(item.id, price)}
                onRemoveAlert={() => onRemovePriceAlert(item.id)}
            />
        )}
      </div>
    </div>
  );
};

export default CartItem;