import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';

interface InputFormProps {
    onSubmit: (thaiDob: str, chineseDob: str) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [thaiDob, setThaiDob] = useState('');
    const [chineseDob, setChineseDob] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (thaiDob && chineseDob) {
            onSubmit(thaiDob, chineseDob);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel p-8 rounded-3xl w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-end"
        >
            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-primary-500 mb-2 uppercase tracking-wider">
                    Inner World (Thai Calendar)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        required
                        value={thaiDob}
                        onChange={(e) => setThaiDob(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-secondary-500 mb-2 uppercase tracking-wider">
                    Outer World (Chinese Calendar)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        required
                        value={chineseDob}
                        onChange={(e) => setChineseDob(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !thaiDob || !chineseDob}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-500 hover:to-secondary-400 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <span className="animate-pulse">Calculating...</span>
                ) : (
                    <>
                        <Search className="w-5 h-5" />
                        <span>Analyze</span>
                    </>
                )}
            </button>
        </motion.form>
    );
};
