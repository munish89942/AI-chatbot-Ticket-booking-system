import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, XCircle, Calendar, Clock, Tag } from 'lucide-react';

export default function ChatWindow({ messages, loading, bookingData, onBookingConfirm, onBookingCancel }) {
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, bookingData]);

    return (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-6 mt-20 space-y-2 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(99,102,241,0.3)_transparent]">
            <AnimatePresence mode="popLayout">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full min-h-[50vh] flex flex-col items-center justify-center text-white/30 space-y-6"
                    >
                        <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <Sparkles size={40} className="text-indigo-400/60" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-semibold text-white/40">Lumina Guide is ready</p>
                            <p className="text-sm text-white/20">Ask me anything about the museum, or start booking your tickets.</p>
                        </div>
                    </motion.div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} isLast={index === messages.length - 1} />
                    ))
                )}

                {/* Typing Indicator */}
                {loading && (
                    <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start gap-3 mb-5"
                    >
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                            <Sparkles className="animate-pulse" size={16} />
                        </div>
                        <div className="flex gap-1.5 px-5 py-4 bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-2xl rounded-tl-none shadow-lg items-center">
                            <div className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce"></div>
                        </div>
                    </motion.div>
                )}

                {/* Booking Confirmation Card */}
                {bookingData && (
                    <motion.div
                        key="booking"
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="max-w-sm mx-auto my-8"
                    >
                        <div className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl border-2 border-indigo-500/40 rounded-3xl shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)]">
                            {/* Subtle top glow stripe */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>
                            
                            {/* Card Header */}
                            <div className="bg-indigo-500/10 px-6 pt-6 pb-4 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2 text-indigo-300 mb-1">
                                    <Sparkles size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Booking Summary</span>
                                </div>
                                <h4 className="text-lg font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                                    Confirm Your Visit
                                </h4>
                            </div>

                            {/* Details */}
                            <div className="px-6 py-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Date</span>
                                        <p className="text-white font-semibold">{bookingData.details.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Time Slot</span>
                                        <p className="text-white font-semibold">{bookingData.details.slot_label}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Tag size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs text-white/40 uppercase tracking-wider">Tickets</span>
                                        <p className="text-white font-semibold">{bookingData.summary?.split('for')[0] || 'See details'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-6 flex gap-3">
                                <button
                                    onClick={onBookingConfirm}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                >
                                    <CheckCircle size={18} />
                                    Confirm & Pay
                                </button>
                                <button
                                    onClick={onBookingCancel}
                                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-2xl font-bold text-sm transition-all"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
        </div>
    );
}
