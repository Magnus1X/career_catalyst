import React from 'react';
import { Rocket, Github, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border-white/10 backdrop-blur-xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <Rocket className="w-6 h-6 text-blue-500 group-hover:rotate-12 transition-transform" />
                    <span className="text-xl font-bold tracking-tight">DevSprint <span className="text-blue-500">AI</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link to="/cp-tracker" className="hover:text-white transition-colors">CP Tracker</Link>
                    <Link to="/code-insights" className="hover:text-white transition-colors">Insights</Link>
                    <Link to="/ai-interviewer" className="hover:text-white transition-colors">Interviewer</Link>
                    <Link to="/educational-rag" className="hover:text-white transition-colors">RAG</Link>
                </div>

                <div className="flex items-center gap-4">
                    <a href="https://github.com/Magnus1X/career_catalyst" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Github className="w-5 h-5" />
                    </a>

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold hidden lg:block">{user.name}</span>
                            </div>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
