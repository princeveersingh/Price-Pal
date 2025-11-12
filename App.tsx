import React, { useState, useCallback } from 'react';
import type { CartItemData } from './types';
import { fetchProductComparisons } from './services/geminiService';
import Header from './components/Header';
import ItemInputForm from './components/ItemInputForm';
import Cart from './components/Cart';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);

  // Fix: Extracted fetch logic into a reusable function to fix retry bug and improve clarity.
  const fetchAndSetComparisons = useCallback(async (itemId: string, itemName:string) => {
    try {
      const comparisons = await fetchProductComparisons(itemName);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, comparisons, isLoading: false, error: null }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to fetch product comparisons:", error);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, error: 'Could not fetch comparison data. Please try again.', isLoading: false }
            : item
        )
      );
    }
  }, []);

  const handleAddItem = useCallback(async (itemName: string) => {
    if (!itemName.trim()) return;

    const newItem: CartItemData = {
      id: uuidv4(),
      name: itemName,
      comparisons: null,
      isLoading: true,
      error: null,
      priceAlert: null,
    };

    setCartItems(prevItems => [newItem, ...prevItems]);
    await fetchAndSetComparisons(newItem.id, newItem.name);
  }, [fetchAndSetComparisons]);
  
  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const handleRetry = useCallback((id: string, name: string) => {
     setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id
            ? { ...item, isLoading: true, error: null }
            : item
        )
      );
      fetchAndSetComparisons(id, name);
  }, [fetchAndSetComparisons]);

  const handleSetPriceAlert = useCallback((id: string, price: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, priceAlert: price } : item
      )
    );
  }, []);

  const handleRemovePriceAlert = useCallback((id: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, priceAlert: null } : item
      )
    );
  }, []);


  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8 animate-slide-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Add a Product to Compare</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Enter the name of a product you want to buy, and we'll find the best deals for you across the web.</p>
            <ItemInputForm onAddItem={handleAddItem} />
        </div>
        <div className="animate-slide-in-up" style={{ animationDelay: '250ms', opacity: 0 }}>
          <Cart
            items={cartItems}
            onRemoveItem={handleRemoveItem}
            onRetry={handleRetry}
            onSetPriceAlert={handleSetPriceAlert}
            onRemovePriceAlert={handleRemovePriceAlert}
          />
        </div>
      </main>
    </div>
  );
};

export default App;