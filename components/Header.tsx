import React, { useState, useEffect } from 'react';

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const LiveDateTime: React.FC = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDateTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timerId);
    }, []);

    const formattedDate = dateTime.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = dateTime.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{formattedDate}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{formattedTime}</p>
        </div>
    );
};


const Header: React.FC = () => {
  return (
    <header className="bg-neutral-100 dark:bg-neutral-800 shadow-md animate-slide-down-fade">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ShoppingCartIcon />
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Price Pal
          </h1>
        </div>
        <LiveDateTime />
      </div>
    </header>
  );
};

export default Header;