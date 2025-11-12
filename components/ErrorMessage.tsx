
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4" role="alert">
        <div className="flex">
            <div className="py-1">
                <svg className="h-6 w-6 text-red-500 dark:text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="font-bold text-red-800 dark:text-red-300">An Error Occurred</p>
                <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
                <button 
                    onClick={onRetry} 
                    className="mt-2 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-red-900/20"
                >
                    Try Again
                </button>
            </div>
        </div>
    </div>
  );
};

export default ErrorMessage;
