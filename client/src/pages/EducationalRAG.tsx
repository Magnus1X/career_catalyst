import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ragApi } from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Search, Book, Loader2, Send, FileText, CheckCircle, MessageSquare } from 'lucide-react';

const EducationalRAG: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [document, setDocument] = useState<any>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; sources?: any[] }[]>([]);

    const userId = '65d1f8a2b3c4d5e6f7a8b9c0'; // Mock ObjectId for dev

    const handleUpload = async () => {
        if (!file) return;
        setProcessing(true);
        try {
            const res = await ragApi.uploadPdf(userId, file);
            setDocument(res.data.document);
            alert('PDF processed and indexed successfully!');
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Failed to process PDF. Make sure backend is running and MongoDB Vector index is setup.');
        } finally {
            setProcessing(false);
        }
    };

    const handleQuery = async () => {
        if (!query || !document) return;
        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await ragApi.query(userId, userMsg);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: res.data.answer,
                sources: res.data.sources
            }]);
        } catch (error) {
            console.error('Query Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: 'Sorry, I failed to process your query. Check backend logs.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 gradient-text">Educational RAG</h2>
                    <p className="text-gray-400 font-medium">Upload technical papers or textbooks and query them using specialized AI.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="md:col-span-1">
                        <div className="glass p-6 rounded-2xl border-white/10 sticky top-32">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FileUp className="text-blue-500 w-5 h-5" /> Knowledge Base
                            </h3>

                            {!document ? (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="pdf-upload"
                                        />
                                        <label htmlFor="pdf-upload" className="cursor-pointer">
                                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-sm text-gray-400">{file ? file.name : 'Select PDF Textbook'}</p>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || processing}
                                        className="w-full bg-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Index Document'}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold truncate">{document.filename}</p>
                                        <p className="text-xs text-emerald-500/70 uppercase font-black">Ready for Q&A</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Capabilities</h4>
                                <ul className="space-y-3 text-xs text-gray-400">
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                                        Technical concept summarization
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                                        Source-backed clarifications
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                                        Complex logic explanation
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="md:col-span-2 flex flex-col h-[70vh] glass rounded-3xl border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                            <MessageSquare className="text-gray-500 w-4 h-4" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Academic Assistant</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
                                    <Book className="w-16 h-16 mb-4" />
                                    <p>Upload a document to start a focused Q&A session.</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-sm font-medium' : 'bg-white/5 text-gray-200 text-sm leading-relaxed'
                                        }`}>
                                        {m.text}
                                        {m.sources && m.sources.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Sources Found</p>
                                                <div className="space-y-2">
                                                    {m.sources.map((s, idx) => (
                                                        <div key={idx} className="text-[11px] text-gray-400 bg-white/5 p-2 rounded-lg italic">
                                                            "{s.content.substring(0, 150)}..."
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl flex gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span className="text-xs text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[#0a0a0a]/50 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={document ? "Ask a question about the document..." : "Upload a PDF first"}
                                    disabled={!document || loading}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-14 focus:outline-none focus:border-blue-500 transition-all font-medium disabled:opacity-50"
                                />
                                <button
                                    onClick={handleQuery}
                                    disabled={!document || !query || loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EducationalRAG;
