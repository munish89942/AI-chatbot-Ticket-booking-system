import React from 'react';
import { Send, Sparkles, Trash2, Mic } from 'lucide-react';

const SUGGESTIONS = [
    "Book Tickets",
    "Museum Timings",
    "Ticket Prices",
    "Location & Directions"
];

export default function ChatInput({ input, setInput, onSend, onClear, loading, disabled }) {
    return (
        <div className="p-4 sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
            <div className="max-w-4xl mx-auto space-y-3">
                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTIONS.map((text) => (
                        <button
                            key={text}
                            onClick={() => setInput(text)}
                            disabled={loading || disabled}
                            className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-indigo-500/15 border border-white/[0.08] hover:border-indigo-500/40 text-xs sm:text-sm text-white/50 hover:text-indigo-300 transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed tracking-wide"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/50 to-purple-600/50 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2 pl-4 focus-within:border-indigo-500/60 transition-all duration-300 shadow-2xl">
                        {/* AI Sparkle Icon */}
                        <Sparkles
                            className={`mr-3 flex-shrink-0 transition-colors duration-300 ${loading ? 'text-indigo-400 animate-pulse' : 'text-indigo-500/40'}`}
                            size={18}
                        />

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && !disabled && onSend()}
                            placeholder={disabled ? "Please confirm or cancel your booking first…" : "Tell me what you'd like to explore…"}
                            className="flex-1 bg-transparent text-white placeholder-white/20 outline-none py-3 text-sm sm:text-base font-light"
                            disabled={loading || disabled}
                        />

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onClear}
                                className="p-2.5 text-white/20 hover:text-red-400/80 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                                title="Clear Chat"
                            >
                                <Trash2 size={18} />
                            </button>

                            <button
                                onClick={onSend}
                                disabled={!input.trim() || loading || disabled}
                                className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/10 text-white rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-95 disabled:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[10px] text-white/15 font-medium tracking-[0.1em] uppercase">
                    Powered by Advanced Museum AI • Lumina Concierge
                </p>
            </div>
        </div>
    );
}
