import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MatrixBoardProps {
    title: string;
    weights: Record<number, number>;
    combos: string[];
    isInner?: boolean;
}

export const MatrixBoard: React.FC<MatrixBoardProps> = ({ title, weights, combos, isInner = true }) => {
    // Required Matrix layout: 
    // Row 1: 1, 4, 7
    // Row 2: 2, 5, 8
    // Row 3: 3, 6, 9, 0

    const layout = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9, 0]
    ];

    const renderShapes = (weight: number) => {
        const shapes = [];
        let remaining = weight;

        // 5pt = Square, 3pt = Triangle, 1pt = Circle
        while (remaining >= 5) {
            shapes.push(<div key={`sq-${remaining}`} className="shape-square" title="5 Points (Life Code)" />);
            remaining -= 5;
        }
        while (remaining >= 3) {
            shapes.push(<div key={`tr-${remaining}`} className="shape-triangle" title="3 Points (Gift Number)" />);
            remaining -= 3;
        }
        while (remaining >= 1) {
            shapes.push(<div key={`cr-${remaining}`} className="shape-circle" title="1 Point (DOB Base)" />);
            remaining -= 1;
        }
        return <div className="flex flex-wrap gap-1 justify-center mt-2 min-h-[24px]">{shapes}</div>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "glass-panel rounded-2xl p-6 flex flex-col items-center w-full min-w-[320px]",
                isInner ? "border-l-4 border-l-primary-500" : "border-l-4 border-l-secondary-500"
            )}
        >
            <h2 className="text-2xl font-bold mb-6 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {title}
            </h2>

            <div className="flex flex-col gap-4 w-full">
                {layout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-4">
                        {row.map((num) => {
                            const isHighlight = combos.some(combo => combo.split('-').includes(num.toString()));
                            return (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    key={num}
                                    className={cn(
                                        "w-20 h-24 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden",
                                        isHighlight ? "bg-white/10 ring-2 ring-accent shadow-[0_0_15px_rgba(20,184,166,0.3)]" : "bg-black/20"
                                    )}
                                >
                                    <span className="text-xl font-bold text-gray-200 opacity-80">
                                        {num}
                                    </span>
                                    {renderShapes(weights[num] || 0)}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {combos.length > 0 && (
                <div className="mt-6 w-full">
                    <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-widest text-center">Active Combos</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {combos.map(combo => (
                            <span key={combo} className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                                {combo}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
