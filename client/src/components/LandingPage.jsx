import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMuseumInfo } from '../services/api';
import { ArrowRight, Clock, MapPin, Building2, Sparkles, Compass, Landmark, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeDScene from './ThreeDScene';

export default function LandingPage() {
    const [info, setInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMuseumInfo().then(res => setInfo(res.data)).catch(console.error);
    }, []);

    const museumName = info?.museum_name || 'Luxe Museum';

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Background Radial Glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
                <nav className="flex justify-between items-center px-6 sm:px-12 h-20 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Landmark className="text-indigo-400" size={28} />
                        <span className="text-xl sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                            {museumName.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-slate-300">
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/about')}>About</span>
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/chat')}>Book Ticket</span>
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/admin')}>Admin</span>
                    </div>

                    <button
                        onClick={() => navigate('/chat')}
                        className="relative group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                    >
                        Start Booking
                    </button>
                </nav>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 sm:px-12 pt-24 max-w-7xl mx-auto gap-8">
                    {/* Left Column - Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex-1 space-y-6 text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-widest uppercase">
                            <Sparkles size={14} />
                            <span>AI-Guided Art Journey</span>
                        </div>
                        
                        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
                            Explore the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Unseen Heritage
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
                            Welcome to {museumName}. Immerse yourself in a state-of-the-art interactive museum experience powered by intelligent guides and simplified digital booking.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => navigate('/chat')}
                                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Booking <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all duration-300"
                            >
                                Explore History
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column - 3D Visual Centerpiece */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex-1 w-full h-[350px] md:h-[500px] flex items-center justify-center relative"
                    >
                        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent blur-3xl pointer-events-none"></div>
                        <ThreeDScene />
                    </motion.div>
                </section>

                {/* Info & Features Bento Grid */}
                <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Our Elite Galleries</h2>
                        <p className="text-slate-400 text-lg">
                            Discover exquisite physical collections and digital wings at {museumName}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Museum Wing (Dynamic Data) */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="text-2xl font-black mb-3">{museumName}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Experience the primary galleries, housing thousands of years of human heritage, historical artifacts, and timeless masterpieces.
                                </p>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <Clock size={16} className="text-indigo-400" />
                                    <span>{info?.opening_hours || '9:00 AM - 6:00 PM'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <MapPin size={16} className="text-indigo-400" />
                                    <span>{info?.address || 'National Museum Road, New Delhi'}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2: Ethereal Digital Wing */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Compass size={24} />
                                </div>
                                <h3 className="text-2xl font-black mb-3">The Ethereal Wing</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    Explore hyper-realistic digital reconstructions, virtual reality exhibits, and AI-curated interactive installations.
                                </p>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <Clock size={16} className="text-purple-400" />
                                    <span>10:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <MapPin size={16} className="text-purple-400" />
                                    <span>Virtual Portal & Hall B</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 3: Omni Digital Archive */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-pink-500/30 hover:bg-white/10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <div className="w-12 h-12 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Shield size={24} />
                                </div>
                                <h3 className="text-2xl font-black mb-3">Omni Digital Archive</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    A secured archive for digitized preservation of rare historical manuscripts, high-fidelity scans, and digital artwork certificates.
                                </p>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <Clock size={16} className="text-pink-400" />
                                    <span>24/7 Digital Access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-300">
                                    <MapPin size={16} className="text-pink-400" />
                                    <span>Online Portal (Member Key)</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Call-to-action Section */}
                <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto text-center">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 sm:p-20 rounded-[40px] space-y-8 relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]"></div>

                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Begin Your Journey Today
                        </h2>
                        
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Connect with our AI assistant to book tickets, inquire about special exhibitions, and personalize your museum itinerary in seconds.
                        </p>

                        <button
                            onClick={() => navigate('/chat')}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1 active:translate-y-0"
                        >
                            Start Chatting with AI Guide
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 sm:px-12 bg-slate-950 mt-12 relative z-10 text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Landmark size={20} className="text-slate-400" />
                        <span className="font-bold tracking-tight text-slate-400">{museumName.toUpperCase()}</span>
                    </div>
                    <p className="text-sm">
                        © {new Date().getFullYear()} {museumName}. Powered by Advanced Museum AI & Stitch.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/about')}>About</span>
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/chat')}>Book</span>
                        <span className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate('/admin')}>Admin</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
