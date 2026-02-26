import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKey] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gemini_api_key') || '';
        }
        return '';
    });
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            onSave(apiKey);
            onClose();
        }
    };

    const handleClear = () => {
        setApiKey('');
        localStorage.removeItem('gemini_api_key');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/20 rounded-lg">
                                    <Key className="w-5 h-5 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Gemini API Key</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            Enter your Gemini API key to enable AI analysis. Your key is stored locally in your browser.
                        </p>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk-... (Gemini API Key)"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showKey ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {apiKey && (
                                <p className="text-xs text-accent">✓ API key is set locally</p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleClear}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!apiKey.trim()}
                                className="flex-1 px-4 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Save Key
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Get your API key from{' '}
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline"
                            >
                                Google AI Studio
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
