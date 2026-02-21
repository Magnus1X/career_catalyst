import React from 'react';
import Navbar from '../components/Navbar';
import BentoGrid from '../components/BentoGrid';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="pt-32 pb-20 px-6">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block glass px-4 py-1.5 rounded-full text-xs font-semibold text-blue-400 mb-6 border-white/10"
                    >
                        Powered by Gemini 1.5 Flash
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        The Intelligent <br />
                        <span className="gradient-text">Career Catalyst</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        DevSprint AI transforms raw data into actionable career insights for software engineers.
                        Accelerate your growth with AI-powered code insights, mock interviews, and personalized roadmaps.
                    </motion.p>
                </div>

                <BentoGrid />
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>© 2026 DevSprint AI. Accelerating Engineer Growth.</p>
            </footer>
        </div>
    );
};

export default Home;
