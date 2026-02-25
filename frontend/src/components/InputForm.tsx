import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Sparkles, BookOpen } from 'lucide-react';
import { Solar, Lunar } from 'lunar-javascript';

interface InputFormProps {
    onSubmit: (thaiDob: string, chineseDob: string) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [birthDate, setBirthDate] = useState('');

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
        if (birthDate) {
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

            onSubmit(thaiDob, chineseDob);
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
                <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1 w-full space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-[0.2em]">
                                <Calendar className="w-4 h-4 !text-white" />
                                Select Your Birth Date
                            </label>
                            <input
                                type="date"
                                required
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
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

                    <div className="flex-shrink-0 mt-6">
                        <button
                            type="submit"
                            disabled={isLoading || !birthDate}
                            className="relative group/btn overflow-hidden px-12 py-5 bg-white text-black font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                            <div className="flex items-center gap-3 relative z-10">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                                        <span className='w-[160px]'>Decoding...</span>
                                    </>
                                ) : (
                                    <div className="hover:cursor-pointer flex items-center gap-3">
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
