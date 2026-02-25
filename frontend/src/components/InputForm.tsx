import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';

interface InputFormProps {
    onSubmit: (thaiDob: string, chineseDob: string) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [thaiD, setThaiD] = useState('');
    const [thaiM, setThaiM] = useState('');
    const [thaiY, setThaiY] = useState('');

    const [chiD, setChiD] = useState('');
    const [chiM, setChiM] = useState('');
    const [chiY, setChiY] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (thaiD && thaiM && thaiY && chiD && chiM && chiY) {
            const thaiDob = `${thaiY}-${thaiM.padStart(2, '0')}-${thaiD.padStart(2, '0')}`;
            const chineseDob = `${chiY}-${chiM.padStart(2, '0')}-${chiD.padStart(2, '0')}`;
            onSubmit(thaiDob, chineseDob);
        }
    };

    const isFormValid = thaiD && thaiM && thaiY && chiD && chiM && chiY;

    return (
        <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel p-8 rounded-3xl w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-end"
        >
            <div className="flex-1 w-full space-y-4">
                <label className="block text-sm font-medium text-primary-500 uppercase tracking-wider">
                    Inner World (Thai Calendar)
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <input
                        type="number"
                        placeholder="DD"
                        required
                        value={thaiD}
                        onChange={(e) => setThaiD(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                    <input
                        type="number"
                        placeholder="MM"
                        required
                        value={thaiM}
                        onChange={(e) => setThaiM(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                    <input
                        type="number"
                        placeholder="YYYY"
                        required
                        value={thaiY}
                        onChange={(e) => setThaiY(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                </div>
            </div>

            <div className="flex-1 w-full space-y-4">
                <label className="block text-sm font-medium text-secondary-500 uppercase tracking-wider">
                    Outer World (Chinese Calendar)
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <input
                        type="number"
                        placeholder="DD"
                        required
                        value={chiD}
                        onChange={(e) => setChiD(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                    <input
                        type="number"
                        placeholder="MM"
                        required
                        value={chiM}
                        onChange={(e) => setChiM(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                    <input
                        type="number"
                        placeholder="YYYY"
                        required
                        value={chiY}
                        onChange={(e) => setChiY(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all outline-none placeholder:text-gray-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full md:w-auto px-8 py-3 h-[50px] bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-500 hover:to-secondary-400 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
