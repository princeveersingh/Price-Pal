import React, { useState, useEffect } from 'react';

interface PriceAlertProps {
  currentAlert?: number | null;
  onSetAlert: (price: number) => void;
  onRemoveAlert: () => void;
}

const PriceAlert: React.FC<PriceAlertProps> = ({ currentAlert, onSetAlert, onRemoveAlert }) => {
  const [price, setPrice] = useState('');
  const [isEditing, setIsEditing] = useState(!currentAlert);

  useEffect(() => {
    // If currentAlert becomes null (e.g., from parent), switch to editing mode.
    // If a currentAlert is set, switch to display mode.
    setIsEditing(!currentAlert);
  }, [currentAlert]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice > 0) {
      onSetAlert(numericPrice);
      setIsEditing(false);
      setPrice('');
    }
  };

  const handleRemove = () => {
    onRemoveAlert();
    setIsEditing(true); // Switch to editing mode after removing
  };
  
  if (!isEditing && currentAlert) {
    return (
        <div className="mt-4 p-3 bg-neutral-200 dark:bg-neutral-700/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Alert is active for drops below <span className="font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(currentAlert)}</span>.
                </p>
            </div>
            <div className="flex-shrink-0">
                 <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-primary hover:underline">Edit</button>
                 <button onClick={handleRemove} className="ml-3 text-sm font-medium text-red-500 hover:underline">Remove</button>
            </div>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 items-center p-3 bg-neutral-200 dark:bg-neutral-700/50 rounded-lg animate-fade-in">
      <label htmlFor={`price-alert-${currentAlert}`} className="sr-only">Price Alert</label>
      <div className="relative flex-grow w-full sm:w-auto">
         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">₹</div>
         <input
            id={`price-alert-${currentAlert}`}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 5000"
            aria-label="Set price alert"
            className="w-full pl-7 pr-3 py-2 bg-neutral-100 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            min="0"
            step="any"
            required
         />
      </div>
      <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary dark:focus:ring-offset-dark transition-colors duration-200">
        Set Alert
      </button>
      {currentAlert && <button type="button" onClick={() => setIsEditing(false)} className="w-full sm:w-auto px-4 py-2 text-neutral-600 dark:text-neutral-300 font-semibold rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600">Cancel</button>}
    </form>
  );
};

export default PriceAlert;