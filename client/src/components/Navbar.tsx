import React from 'react';
import { Rocket, Github, Trophy } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
            <div className="glass-morphism px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Rocket className="text-blue-500 w-6 h-6" />
                    <span className="text-xl font-bold gradient-text">DevSprint AI</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <a href="#" className="hover:text-white transition-colors">Analyzer</a>
                    <a href="#" className="hover:text-white transition-colors">Interview</a>
                    <a href="#" className="hover:text-white transition-colors">RAG</a>
                    <a href="#" className="hover:text-white transition-colors">Journey</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
