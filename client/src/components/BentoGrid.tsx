import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code, Mic, FileText, ArrowRight } from 'lucide-react';

interface BentoCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
    delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ title, description, icon, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`bento-card group flex flex-col justify-between h-full ${className}`}
    >
        <div>
            <div className="p-3 w-fit rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
            Explore Module <ArrowRight className="w-4 h-4" />
        </div>
    </motion.div>
);

const BentoGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-6 py-12">
            <BentoCard
                delay={0.1}
                className="md:col-span-2"
                title="CP Journey Tracker"
                description="Analyze your Codeforces performance, identify weak topics like DP or Graphs, and get a personalized AI-powered training roadmap."
                icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            />
            <BentoCard
                delay={0.2}
                title="Intelligent Code Insights"
                description="Deep dive into code comprehension with Big O notation analysis and human-readable logic breakdowns."
                icon={<Code className="w-6 h-6 text-blue-500" />}
            />
            <BentoCard
                delay={0.3}
                title="AI Mock Interviewer"
                description="Practice technical interviews with voice-first interaction and high-fidelity feedback on accuracy and clarity."
                icon={<Mic className="w-6 h-6 text-purple-500" />}
            />
            <BentoCard
                delay={0.4}
                className="md:col-span-2"
                title="Educational RAG"
                description="Upload technical PDFs or textbooks and query them using an AI-summarized specialized Retrieval-Augmented Generation system."
                icon={<FileText className="w-6 h-6 text-emerald-500" />}
            />
        </div>
    );
};

export default BentoGrid;
