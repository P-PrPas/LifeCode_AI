import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Sparkles, BookOpen } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';

interface InputFormProps {
    onSubmit: (thaiDob: string, chineseDob: string, language: 'th' | 'en', apiKey: string) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [birthDate, setBirthDate] = useState('');
    const [language, setLanguage] = useState<'th' | 'en'>('th');
    const [apiKey, setApiKey] = useState('');

    const previews = useMemo(() => {
        if (!birthDate) return { thai: '', chinese: '' };
        
        try {
            const date = new Date(birthDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            // Gregorian year (AD) calculation - no offset
            const thaiDatePreview = `${day} / ${month} / ${year}`;

            // Chinese Lunar Calculation
            const solar = Solar.fromYmd(year, month, day);
            const lunar = solar.getLunar();
            const chineseDatePreview = `${lunar.getDay()} / ${lunar.getMonth()} / ${lunar.getYear()}`;
            
            return { thai: thaiDatePreview, chinese: chineseDatePreview };
        } catch (e) {
            return { thai: '', chinese: '' };
        }
    }, [birthDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (birthDate && apiKey.trim()) {
            const date = new Date(birthDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            // Gregorian: YYYY-MM-DD
            const thaiDob = `${year}-${month}-${day}`;

            // Chinese: YYYY(Lunar)-MM-DD
            const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const lunar = solar.getLunar();
            const chineseDob = `${lunar.getYear()}-${lunar.getMonth().toString().padStart(2, '0')}-${lunar.getDay().toString().padStart(2, '0')}`;

            onSubmit(thaiDob, chineseDob, language, apiKey);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            <form
                onSubmit={handleSubmit}
                className="glass-panel p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* top row: API key only */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold">Gemini API Key *</label>
                        <input
                            type="password"
                            required
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                        />
                        <p className="text-[10px] text-gray-500">Get your key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google AI Studio</a></p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                    </div>

                    {/* bottom row: date left, button right */}
                    <div className="space-y-4">
                        <div className="space-y-3 mt-2">
                            <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
                                <Calendar className="w-4 h-4 text-white" />
                                <span className="text-gray-400">Select Your Birth Date</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full mt-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <AnimatePresence>
                            {birthDate && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
                                        <p className="text-[10px] text-primary-400 uppercase font-bold tracking-widest mb-1">Inner World (Thai)</p>
                                        <p className="text-white font-mono">{previews.thai}</p>
                                    </div>
                                    <div className="p-4 bg-secondary-500/10 border border-secondary-500/20 rounded-2xl">
                                        <p className="text-[10px] text-secondary-400 uppercase font-bold tracking-widest mb-1">Outer World (Chinese)</p>
                                        <p className="text-white font-mono">{previews.chinese}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col items-end justify-end space-y-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold">Response Language:</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                            >
                                <option value="th">Thai (TH)</option>
                                <option value="en">English (EN)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !birthDate || !apiKey.trim()}
                            className="relative group/btn overflow-hidden px-12 py-5 bg-white text-black font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 w-full md:w-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                            <div className="flex items-center gap-3 relative z-10">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                                        <span className='w-[160px]'>Decoding...</span>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Search className="w-6 h-6" />
                                        <span className="w-[160px] text-xl">Analyze Matrix</span>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4 text-xs text-gray-500 italic">
                    <BookOpen className="w-4 h-4" />
                    <p>We automatically convert your Solar birth date to Thai BE and Chinese Lunar calendars for 100% calculation accuracy.</p>
                </div>
            </form>
        </motion.div>
    );
};
