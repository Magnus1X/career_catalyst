import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { interviewApi } from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RefreshCw, CheckCircle, AlertCircle, Loader2, Award, Zap, MessageSquare } from 'lucide-react';

const AIMockInterviewer: React.FC = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await interviewApi.getQuestions();
                setQuestions(res.data);
            } catch (err) {
                console.error('Failed to fetch questions');
            }
        };
        fetchQuestions();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                setAudioUrl(URL.createObjectURL(audioBlob));
            };

            mediaRecorder.current.start();
            setRecording(true);
            setResult(null);
        } catch (err) {
            alert('Microphone access denied or not available.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && recording) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const handleSubmit = async () => {
        if (audioChunks.current.length === 0) return;

        setLoading(true);
        try {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], 'answer.webm', { type: 'audio/webm' });

            const res = await interviewApi.processAnswer(questions[currentIdx], audioFile);
            setResult(res.data);
        } catch (err) {
            console.error('Submit Error:', err);
            alert('Failed to process interview answer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4 glass px-4 py-1.5 rounded-full text-xs font-semibold text-purple-400 border-white/10">
                        <Mic className="w-3 h-3" /> Voice-First Interaction
                    </div>
                    <h2 className="text-4xl font-bold mb-4 gradient-text">AI Mock Interviewer</h2>
                    <p className="text-gray-400">Practice your technical communication skills with real-time AI feedback.</p>
                </div>

                {questions.length > 0 && (
                    <div className="glass p-8 rounded-3xl border-white/10 shadow-2xl mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <MessageSquare className="w-48 h-48 rotate-12" />
                        </div>

                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</span>
                                <button
                                    onClick={() => setCurrentIdx((prev) => (prev + 1) % questions.length)}
                                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Skip Question
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold mb-12 leading-tight">
                                "{questions[currentIdx]}"
                            </h3>

                            <div className="flex flex-col items-center gap-8">
                                {/* Recording UI */}
                                <div className="relative">
                                    {recording && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                                        />
                                    )}
                                    <button
                                        onClick={recording ? stopRecording : startRecording}
                                        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${recording ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/50'
                                            } shadow-lg`}
                                    >
                                        {recording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
                                    </button>
                                </div>

                                <div className="flex items-center gap-6">
                                    {audioUrl && !recording && (
                                        <button
                                            onClick={() => new Audio(audioUrl).play()}
                                            className="glass px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
                                        >
                                            <Play className="w-4 h-4 fill-white" /> Listen
                                        </button>
                                    )}
                                    {audioChunks.current.length > 0 && !recording && (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="bg-blue-600 px-8 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get AI Feedback'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass p-6 rounded-2xl text-center">
                                    <p className="text-xs text-gray-500 uppercase mb-2">Overall Score</p>
                                    <div className="text-4xl font-black text-blue-400">{result.evaluation.score}/100</div>
                                </div>
                                <div className="glass p-6 rounded-2xl md:col-span-2">
                                    <p className="text-xs text-gray-500 uppercase mb-2">Feedback Summary</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">"{result.evaluation.feedback}"</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap className="text-emerald-500 w-5 h-5" />
                                        <h4 className="font-bold">Accuracy & Clarity</h4>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <p><span className="text-gray-500">Accuracy: </span>{result.evaluation.technicalAccuracy}</p>
                                        <p><span className="text-gray-500">Clarity: </span>{result.evaluation.clarity}</p>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="text-blue-500 w-5 h-5" />
                                        <h4 className="font-bold">Improvement Tips</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {result.evaluation.improvementTips.map((tip: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-400">
                                                <CheckCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AIMockInterviewer;
