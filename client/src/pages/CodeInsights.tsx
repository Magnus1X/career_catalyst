import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { codeInsightsApi } from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Zap, Brain, Loader2, Sparkles, Clock, Layers } from 'lucide-react';

const CodeInsights: React.FC = () => {
    const [code, setCode] = useState('// Paste your code here\nfunction example() {\n  console.log("Hello World");\n}');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [breakdown, setBreakdown] = useState<any>(null);

    const handleAnalyze = async (type: 'complexity' | 'logic') => {
        setLoading(true);
        try {
            if (type === 'complexity') {
                const res = await codeInsightsApi.analyzeComplexity(code, language);
                setAnalysis(res.data);
            } else {
                const res = await codeInsightsApi.breakdownLogic(code, language);
                setBreakdown(res.data);
            }
        } catch (error) {
            console.error('Analysis Error:', error);
            alert('Failed to analyze code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Editor Section */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Code2 className="text-blue-500 w-6 h-6" />
                                <h2 className="text-2xl font-bold">Code Lab</h2>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                        </div>

                        <div className="glass p-1 rounded-2xl border-white/10 shadow-2xl">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-[500px] bg-[#0d0d1a]/50 p-6 rounded-xl font-mono text-sm leading-relaxed focus:outline-none resize-none text-blue-100"
                                spellCheck={false}
                            />
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <button
                                onClick={() => handleAnalyze('complexity')}
                                disabled={loading}
                                className="flex-1 gradient-bg p-[1px] rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                                <div className="bg-[#0a0a0a] rounded-[11px] h-full py-3 flex items-center justify-center gap-2 font-bold text-blue-400">
                                    <Clock className="w-5 h-5" />
                                    Analyze Complexity
                                </div>
                            </button>
                            <button
                                onClick={() => handleAnalyze('logic')}
                                disabled={loading}
                                className="flex-1 gradient-bg p-[1px] rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                                <div className="bg-[#0a0a0a] rounded-[11px] h-full py-3 flex items-center justify-center gap-2 font-bold text-purple-400">
                                    <Brain className="w-5 h-5" />
                                    Logic Breakdown
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Insights Panel */}
                    <div className="w-full lg:w-96 flex flex-col gap-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="text-yellow-500 w-5 h-5" />
                            <h3 className="text-xl font-bold">AI Insights</h3>
                        </div>

                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-64"
                                >
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                    <p className="text-gray-400 animate-pulse">Consulting Gemini for insights...</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {analysis && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass p-6 rounded-2xl border-l-4 border-blue-500"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles className="text-blue-400 w-5 h-5" />
                                                <h4 className="font-bold">Big O Analysis</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time Complexity</p>
                                                    <p className="font-mono text-xl text-blue-400 font-bold">{analysis.timeComplexity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Space Complexity</p>
                                                    <p className="font-mono text-xl text-emerald-400 font-bold">{analysis.spaceComplexity}</p>
                                                </div>
                                                <p className="text-sm text-gray-400 leading-relaxed">{analysis.explanation}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {breakdown && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass p-6 rounded-2xl border-l-4 border-purple-500"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <Layers className="text-purple-400 w-5 h-5" />
                                                <h4 className="font-bold">Logic Breakdown</h4>
                                            </div>
                                            <div className="space-y-4">
                                                {breakdown.steps.map((step: string, idx: number) => (
                                                    <div key={idx} className="flex gap-3 text-sm">
                                                        <span className="text-purple-400 font-bold">{idx + 1}.</span>
                                                        <span className="text-gray-300">{step}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-xs text-gray-500 uppercase mb-2">Summary</p>
                                                    <p className="text-sm text-gray-400 italic">{breakdown.summary}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {!analysis && !breakdown && (
                                        <div className="glass p-12 rounded-2xl text-center flex flex-col items-center gap-4 opacity-50">
                                            <Code2 className="w-12 h-12 text-gray-600" />
                                            <p className="text-gray-500 text-sm">Paste some code and click an analysis button to get started.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <style>{`
        .gradient-bg {
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #10b981);
        }
      `}</style>
        </div>
    );
};

export default CodeInsights;
