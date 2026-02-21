import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { cpTrackerApi } from '../services/api.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Target, BookOpen, CheckCircle2 } from 'lucide-react';

const CPTracker: React.FC = () => {
    const [handle, setHandle] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [roadmap, setRoadmap] = useState<any>(null);

    const handleSearch = async () => {
        if (!handle) return;
        setLoading(true);
        try {
            const insightsRes = await cpTrackerApi.getInsights(handle);
            setData(insightsRes.data);

            const roadmapRes = await cpTrackerApi.getRoadmap(handle);
            setRoadmap(roadmapRes.data.roadmap);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error fetching Codeforces data. Please check the handle.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 gradient-text">CP Journey Tracker</h2>
                    <p className="text-gray-400">Enter your Codeforces handle to analyze your performance and get a custom training plan.</p>
                </div>

                <div className="flex gap-4 max-w-md mx-auto mb-16">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Codeforces Handle"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="glass px-6 py-3 rounded-xl font-bold text-blue-400 hover:bg-white/10 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
                    </button>
                </div>

                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12"
                        >
                            {/* Weak Topics */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Target className="text-red-500 w-6 h-6" />
                                    <h3 className="text-2xl font-bold">Weak Areas</h3>
                                </div>
                                <div className="space-y-4">
                                    {data.weakTopics.map((topic: any, idx: number) => (
                                        <div key={idx} className="glass p-4 rounded-xl flex items-center justify-between border-l-4 border-red-500/50">
                                            <div>
                                                <div className="font-bold text-lg capitalize">{topic.tag}</div>
                                                <div className="text-sm text-gray-400">{topic.total} submissions analyzed</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-red-400 font-bold">{Math.round(topic.failureRate * 100)}%</div>
                                                <div className="text-xs text-gray-500">Failure Rate</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* AI Roadmap */}
                            {roadmap && (
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <BookOpen className="text-blue-500 w-6 h-6" />
                                        <h3 className="text-2xl font-bold">Training Roadmap</h3>
                                    </div>
                                    <div className="glass p-6 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <CheckCircle2 className="w-24 h-24 text-blue-500" />
                                        </div>
                                        <div className="relative">
                                            <p className="text-gray-300 mb-6 leading-relaxed italic">"{roadmap.overview}"</p>

                                            <div className="space-y-6">
                                                {roadmap.plan.slice(0, 3).map((day: any, idx: number) => (
                                                    <div key={idx} className="border-l-2 border-white/10 pl-4 py-1">
                                                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Day {day.day}</div>
                                                        <div className="font-bold mb-1">{day.topic}</div>
                                                        <div className="text-sm text-gray-400">{day.tasks[0]}</div>
                                                    </div>
                                                ))}
                                                <div className="text-center pt-4">
                                                    <button className="text-blue-400 text-sm font-bold hover:underline">View Full 2-Week Plan</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CPTracker;
