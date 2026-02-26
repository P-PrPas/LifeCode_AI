import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface ShapeCount {
    circles: number;
    triangles: number;
    squares: number;
}

interface MatrixBoardProps {
    title: string;
    shapes: Record<number, ShapeCount>;
    combos: string[];
    isInner?: boolean;
    language?: 'th' | 'en';
}

const matrixKeywords: Record<number, { th: string; en: string }> = {
    1: { th: 'ตนเอง', en: 'Identity' },
    2: { th: 'คู่ครอง', en: 'Partner' },
    3: { th: 'สร้างสรรค์', en: 'Creation' },
    4: { th: 'นิ่ง/ปัญญา', en: 'Wisdom' },
    5: { th: 'กลาง/สมดุล', en: 'Core' },
    6: { th: 'มั่งคั่ง', en: 'Wealth' },
    7: { th: 'ประสบการณ์', en: 'Experience' },
    8: { th: 'อำนาจ', en: 'Power' },
    9: { th: 'สำเร็จ', en: 'Success' },
    0: { th: 'จิตวิญญาณ', en: 'Spirit' }
};

export const MatrixBoard: React.FC<MatrixBoardProps> = ({ title, shapes, combos, isInner = true, language = 'en' }) => {
    const layout = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9, 0]
    ];

    const renderShapes = (shapeCount?: ShapeCount) => {
        if (!shapeCount) return <div className="min-h-[24px]" />;
        const shapesElements = [];

        for (let i = 0; i < shapeCount.squares; i++) {
            shapesElements.push(<div key={`sq-${i}`} className="w-2 h-2 bg-accent shadow-[0_0_8px_rgba(20,184,166,0.6)]" title="5 Points (Life Code)" />);
        }
        for (let i = 0; i < shapeCount.triangles; i++) {
            shapesElements.push(<div key={`tr-${i}`} className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-bottom-[7px] border-b-primary-400" style={{ borderBottom: '7px solid #3b82f6' }} title="3 Points (Gift Number)" />);
        }
        for (let i = 0; i < shapeCount.circles; i++) {
            shapesElements.push(<div key={`cr-${i}`} className="w-2 h-2 border border-white/40 rounded-full" title="1 Point (DOB Base)" />);
        }
        return <div className="flex flex-wrap gap-1 justify-center mt-auto min-h-[24px] pb-1">{shapesElements}</div>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "glass-panel rounded-[2.5rem] p-8 flex flex-col items-center w-full min-w-[320px] border border-white/5 shadow-2xl relative overflow-hidden",
                isInner ? "bg-primary-500/5 shadow-primary-500/10" : "bg-secondary-500/5 shadow-secondary-500/10"
            )}
        >
            <div className={cn(
                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
                isInner ? "from-primary-500 to-accent" : "from-secondary-500 to-accent"
            )} />

            <h2 className="text-3xl font-black mb-1 tracking-tight text-white">
                {title}
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-8">Matrix Visualization</p>

            <div className="flex flex-col gap-3 w-full">
                {layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-3">
                        {row.map((num) => {
                            const isHighlight = combos.some(combo => combo.split('-').includes(num.toString()));
                            const keyword = matrixKeywords[num];
                            const lang = language === 'th' ? keyword.th : keyword.en;
                            return (
                                <motion.div
                                    whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    key={num}
                                    className={cn(
                                        "w-[85px] h-[100px] rounded-2xl flex flex-col items-center p-2 relative transition-all duration-300 border border-white/5",
                                        isHighlight ? "bg-white/10 ring-1 ring-accent/50 shadow-[0_0_20px_rgba(20,184,166,0.2)]" : "bg-black/40"
                                    )}
                                >
                                    <div className="flex justify-between w-full px-1">
                                        <span className={cn(
                                            "text-lg font-black",
                                            isHighlight ? "text-accent" : "text-gray-600"
                                        )}>
                                            {num}
                                        </span>
                                        <span className="text-[8px] text-gray-500 font-medium uppercase mt-1">
                                            {lang}
                                        </span>
                                    </div>

                                    {renderShapes(shapes[num])}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {combos.length > 0 && (
                <div className="mt-8 w-full">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest px-2">Active Combos</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {combos.map(combo => (
                            <span key={combo} className="px-4 py-1.5 rounded-xl text-[10px] font-black bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider shadow-lg shadow-accent/5">
                                {combo}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

