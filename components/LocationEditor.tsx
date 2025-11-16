import React, { useState, useEffect } from 'react';

interface LocationEditorProps {
    location: string;
    onLocationChange: (newLocation: string) => void;
}

const MapPinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const LocationEditor: React.FC<LocationEditorProps> = ({ location, onLocationChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(location);

    useEffect(() => {
        setInputValue(location);
    }, [location]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onLocationChange(inputValue.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setInputValue(location);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSave} className="flex items-center gap-2 animate-fade-in">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-40 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    aria-label="Edit location"
                    autoFocus
                />
                <button type="submit" className="px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark">Save</button>
                <button type="button" onClick={handleCancel} className="text-sm text-neutral-600 dark:text-neutral-300 hover:underline">Cancel</button>
            </form>
        );
    }

    return (
        <div className="hidden sm:flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
            <MapPinIcon />
            <div className="text-right">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Your Location</p>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary dark:group-hover:text-secondary transition-colors">{location}</p>
            </div>
            <button className="text-xs text-neutral-500 dark:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Edit location">
                Edit
            </button>
        </div>
    );
};

export default LocationEditor;
