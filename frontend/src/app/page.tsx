"use client";

import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { MatrixBoard } from '@/components/MatrixBoard';
import { AnalysisResult } from '@/components/AnalysisResult';

interface NumberAnalysis {
  dob_digits: number[];
  gift_number: number;
  life_code: number;
  weights: Record<number, number>;
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

  const handleAnalyze = async (thaiDob: string, chineseDob: string) => {
    setIsLoading(true);
    setError(null);
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
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid md:grid-cols-2 gap-8 w-full">
              <MatrixBoard
                title="Inner World"
                weights={result.inner_world.weights}
                combos={result.inner_world.combo_lines}
                isInner={true}
              />
              <MatrixBoard
                title="Outer World"
                weights={result.outer_world.weights}
                combos={result.outer_world.combo_lines}
                isInner={false}
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
