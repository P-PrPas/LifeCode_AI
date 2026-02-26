"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputForm } from '@/components/InputForm';
import { MatrixBoard } from '@/components/MatrixBoard';
import { AnalysisResult } from '@/components/AnalysisResult';

interface ShapeCount {
  circles: number;
  triangles: number;
  squares: number;
}

interface NumberAnalysis {
  dob_digits: number[];
  gift_number: number;
  life_code: number;
  weights: Record<number, number>;
  shapes: Record<number, ShapeCount>;
  combo_lines: string[];
}

interface AnalysisResponse {
  inner_world: NumberAnalysis;
  outer_world: NumberAnalysis;
  ai_analysis: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  const handleAnalyze = async (thaiDob: string, chineseDob: string, language: 'th' | 'en', apiKey: string) => {
    setIsLoading(true);
    setError(null);
    setLanguage(language);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thai_dob: thaiDob,
          chinese_dob: chineseDob,
          language,
          api_key: apiKey,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await res.json();
      const aiText = typeof data?.ai_analysis === 'string' ? data.ai_analysis : '';
      const isAiError = aiText.startsWith('Error generating analysis from Gemini:');

      if (isAiError) {
        setError('Gemini API error. Please check your API key and try again.');
        setResult({ ...data, ai_analysis: '' });
        return;
      }

      setResult(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 drop-shadow-sm">
            Life Code Matrix
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Calculate your Inner and Outer World numbers based on Thai and Chinese calendars.
            Uncover hidden combos and let AI reveal your cosmic destiny.
          </p>
        </div>

        {/* Input Form */}
        <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setError(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <h2 className="text-xl font-bold text-white">Analysis Error</h2>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {error}
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid md:grid-cols-2 gap-8 w-full">
              <MatrixBoard
                title="Inner World"
                shapes={result.inner_world.shapes}
                combos={result.inner_world.combo_lines}
                isInner={true}
                language={language}
              />
              <MatrixBoard
                title="Outer World"
                shapes={result.outer_world.shapes}
                combos={result.outer_world.combo_lines}
                isInner={false}
                language={language}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full">
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-primary-500">
                <h3 className="text-xl font-bold mb-4">Thai Calendar Numbers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="font-semibold text-white">DOB digits:</span> {result.inner_world.dob_digits.join(', ')}</li>
                  <li><span className="font-semibold text-white">Gift Number:</span> {result.inner_world.gift_number}</li>
                  <li><span className="font-semibold text-white">Life Code:</span> {result.inner_world.life_code}</li>
                </ul>
              </div>
              <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-secondary-500">
                <h3 className="text-xl font-bold mb-4">Chinese Calendar Numbers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="font-semibold text-white">DOB digits:</span> {result.outer_world.dob_digits.join(', ')}</li>
                  <li><span className="font-semibold text-white">Gift Number:</span> {result.outer_world.gift_number}</li>
                  <li><span className="font-semibold text-white">Life Code:</span> {result.outer_world.life_code}</li>
                </ul>
              </div>
            </div>

            <AnalysisResult analysis={result.ai_analysis} />
          </div>
        )}
      </div>
    </main>
  );
}
