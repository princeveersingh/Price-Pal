import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary dark:border-secondary"></div>
        <p className="text-neutral-500 dark:text-neutral-400">Searching for the best deals...</p>
    </div>
  );
};

export default Loader;