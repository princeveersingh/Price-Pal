import React, { useState, useCallback, useEffect } from 'react';
import type { CartItemData } from './types';
import { fetchProductComparisons } from './services/geminiService';
import Header from './components/Header';
import ItemInputForm from './components/ItemInputForm';
import Cart from './components/Cart';
import { v4 as uuidv4 } from 'uuid';
import FloatingAssistant from './components/FloatingAssistant';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [location, setLocation] = useState<string>(() => localStorage.getItem('userLocation') || 'New Delhi, India');

  useEffect(() => {
    localStorage.setItem('userLocation', location);
  }, [location]);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    // Note: We are not refetching existing items on location change to avoid excessive API calls.
    // The new location will be used for any new items added or retried.
  };

  const fetchAndSetComparisons = useCallback(async (itemId: string, itemName: string, loc: string) => {
    try {
      const comparisons = await fetchProductComparisons(itemName, loc);
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
    await fetchAndSetComparisons(newItem.id, newItem.name, location);
  }, [fetchAndSetComparisons, location]);
  
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
      fetchAndSetComparisons(id, name, location);
  }, [fetchAndSetComparisons, location]);

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
  
  const getAssistantStatus = (): 'idle' | 'loading' | 'hasItems' | 'error' => {
    const isLoading = cartItems.some(item => item.isLoading);
    if (isLoading) return 'loading';

    const hasError = cartItems.some(item => item.error);
    if (hasError) return 'error';

    if (cartItems.length > 0) return 'hasItems';

    return 'idle';
  };


  return (
    <div className="min-h-screen font-sans">
      <Header location={location} onLocationChange={handleLocationChange} />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-xl shadow-lg mb-8 animate-slide-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Add a Product to Compare</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Enter the name of a product you want to buy, and we'll find the best deals for you across the web.</p>
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
      <FloatingAssistant 
        status={getAssistantStatus()} 
        onClick={() => setIsChatbotOpen(true)} 
      />
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        cartItems={cartItems}
      />
    </div>
  );
};

export default App;