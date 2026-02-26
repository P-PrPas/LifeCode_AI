import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AnalysisResultProps {
    analysis: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
    if (!analysis) return null;

    // Formatting markdown-ish text to standard HTML for simplicity 
    // (Gemini might return markdown like **bold**)
    const formattedText = analysis.split('\n').map((line, i) => {
        if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-primary-500">{line.replace('###', '').trim()}</h3>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="mb-1 text-gray-300 leading-relaxed">{line.replace(/\*\*/g, '')}</p>;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 mt-12 w-full max-w-6xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-3 bg-accent/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary-500">
                    AI Destiny Analysis
                </h2>
            </div>

            <div className="prose prose-invert max-w-none">
                {formattedText}
            </div>
        </motion.div>
    );
};
