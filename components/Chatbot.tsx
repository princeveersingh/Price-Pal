import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, CartItemData } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItemData[];
}

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        AI
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-600 flex items-center justify-center text-neutral-500 dark:text-neutral-300 font-bold text-sm flex-shrink-0">
        You
    </div>
);

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
    </div>
);


const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, cartItems }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: uuidv4(), text: "Hello! I'm your Price Pal Assistant. How can I help you find the best deals today?", sender: 'bot' }
            ]);
        }
    }, [isOpen, messages.length]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: uuidv4(),
            text: inputValue,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponseText = await getChatbotResponse(inputValue, cartItems);
            const botMessage: ChatMessage = {
                id: uuidv4(),
                text: botResponseText,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: uuidv4(),
                text: "Sorry, something went wrong. Please try again.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-center items-end sm:items-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
            <div 
                className={`bg-neutral-100 dark:bg-neutral-800 w-full max-w-lg h-[80vh] max-h-[700px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ animation: isOpen ? 'slideInUp 0.3s ease-out' : 'none' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                    <h2 id="chatbot-title" className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Price Pal Assistant</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <BotIcon />}
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                {msg.sender === 'user' && <UserIcon />}
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex items-start gap-3">
                                <BotIcon />
                                <div className="max-w-[80%] p-3 rounded-2xl bg-neutral-200 dark:bg-neutral-700 rounded-bl-none">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <footer className="p-4 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Ask me anything about shopping..."
                            className="flex-grow w-full px-4 py-2 bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-offset-dark"
                            disabled={isLoading}
                            aria-label="Your message"
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-primary text-white rounded-full p-2 hover:bg-primary-hover disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors" aria-label="Send message">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default Chatbot;