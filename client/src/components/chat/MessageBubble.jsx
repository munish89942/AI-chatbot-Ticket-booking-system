import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Simple markdown-like renderer for bold and line breaks
function renderContent(text) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={i}>
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                })}
                {i < lines.length - 1 && <br />}
            </span>
        );
    });
}

export default function MessageBubble({ message }) {
    const isAi = message.role === 'assistant';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "flex w-full mb-5 gap-3",
                isAi ? "justify-start" : "justify-end"
            )}
        >
            {isAi && (
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mt-0.5">
                    <Bot size={18} />
                </div>
            )}

            <div className={cn(
                "flex flex-col max-w-[80%] sm:max-w-[70%]",
                isAi ? "items-start" : "items-end"
            )}>
                <div className={cn(
                    "px-5 py-3.5 rounded-2xl shadow-lg leading-relaxed text-sm sm:text-base",
                    isAi
                        ? "bg-white/[0.06] backdrop-blur-md border border-white/[0.1] text-white/90 rounded-tl-none"
                        : "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none shadow-indigo-500/20"
                )}>
                    {renderContent(message.content)}
                </div>
                <span className="text-[10px] text-white/25 mt-1.5 font-medium tracking-widest uppercase">
                    {isAi ? 'Lumina AI' : 'You'} • {timestamp}
                </span>
            </div>

            {!isAi && (
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mt-0.5">
                    <User size={18} />
                </div>
            )}
        </motion.div>
    );
}
