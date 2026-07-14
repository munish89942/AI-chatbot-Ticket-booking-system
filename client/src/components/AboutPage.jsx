import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Landmark, History, Paintbrush, Compass, Sparkles } from 'lucide-react';
import museumFacade from '../assets/museum_facade.png';

const JaliPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" viewBox="0 0 100 100">
        <pattern id="jali" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" />
            <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect width="100" height="100" fill="url(#jali)" />
    </svg>
);

const Section = ({ children, className }) => (
    <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`min-h-screen flex flex-col items-center justify-center relative px-6 py-20 ${className}`}
    >
        {children}
    </motion.section>
);

export default function AboutPage() {
    const navigate = useNavigate();
    const [isDark, setIsDark] = React.useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const facadeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const facadeScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

    return (
        <div className={`${isDark ? 'bg-[#1A1614] text-[#FDF6ED]' : 'bg-[#FFFDF9] text-[#2D241E]'} selection:bg-orange-100/30 overflow-x-hidden font-serif transition-colors duration-500`}>
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 bg-orange-400 origin-left z-[100]"
                style={{ scaleX }}
            />

            <JaliPattern />

            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ opacity: facadeOpacity, scale: facadeScale }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={museumFacade}
                        alt="Museum Facade"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FFFDF9]"></div>
                </motion.div>

                <div className="relative z-10 text-center space-y-6 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white mb-8"
                    >
                        <Landmark size={48} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-6xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-2xl"
                    >
                        NATIONAL <span className="block text-orange-400 italic">MUSEUM</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-xl text-white/90 font-medium tracking-widest uppercase"
                    >
                        New Delhi • Gateway to Bharat's Soul
                    </motion.p>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Heritage Section */}
            <Section className={isDark ? "bg-[#1A1614]" : "bg-white"}>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold tracking-widest uppercase">
                            <History size={16} />
                            <span>Established 1949</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold leading-tight">Preserving the <span className="text-orange-600">Continuity</span> of Civilization</h2>
                        <p className={`text-lg ${isDark ? 'text-orange-100/70' : 'text-[#5D4F44]'} leading-relaxed`}>
                            Formed amidst the dawn of independence, the National Museum serves as the primary custodian of India's cultural and historical legacy, housing over 200,000 works of art spanning 5,000 years.
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`aspect-square ${isDark ? 'bg-[#2D241E]' : 'bg-[#FDF6ED]'} rounded-[40px] border ${isDark ? 'border-orange-900/30' : 'border-orange-100'} overflow-hidden shadow-2xl relative group`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-transparent"></div>
                        <div className="h-full w-full flex items-center justify-center p-12">
                            <Landmark size={120} className={`${isDark ? 'text-orange-900/50' : 'text-orange-200'} group-hover:text-orange-300 transition-colors`} />
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Architectural Theme Section */}
            <Section className="bg-[#F9F5F0]">
                <div className="text-center max-w-3xl mx-auto space-y-8 mb-20">
                    <h2 className="text-4xl sm:text-5xl font-bold">Architectural <span className="text-orange-600">Symmetry</span></h2>
                    <p className={`text-lg ${isDark ? 'text-orange-100/70' : 'text-[#5D4F44]'}`}>
                        Inspired by the grand structural traditions of Bharat, our museum reflects a harmony of space, light, and geometry.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl w-full">
                    {[
                        { icon: Paintbrush, title: "Artistry", desc: "Intricate carvings and traditional motifs that breathe life into stone." },
                        { icon: Compass, title: "Grandeur", desc: "Vast corridors designed for reflection and discovery." },
                        { icon: Sparkles, title: "Illumination", desc: "Natural light filtered through handcrafted jali screens." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className={`p-8 ${isDark ? 'bg-[#2D241E] border-orange-900/30' : 'bg-white border-orange-100'} rounded-3xl border shadow-xl space-y-4 text-center group`}
                        >
                            <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            <p className={isDark ? 'text-orange-100/60' : 'text-[#5D4F44]'}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* CTA Section */}
            <Section className={isDark ? "bg-[#1A1614]" : "bg-[#FFFDF9]"}>
                <div className="glass-effect p-12 sm:p-20 rounded-[60px] text-center space-y-10 max-w-5xl w-full border-orange-200/30">
                    <div className="space-y-4">
                        <h2 className="text-5xl sm:text-7xl font-bold tracking-tight">Begin Your <span className="text-orange-600">Infinite</span> Journey</h2>
                        <p className="text-xl sm:text-2xl text-[#5D4F44] max-w-2xl mx-auto italic font-medium">
                            "Art is the signature of civilization."
                        </p>
                    </div>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className={`group relative inline-flex items-center gap-4 px-12 py-5 ${isDark ? 'bg-orange-500 text-white' : 'bg-[#2D241E] text-[#FFFDF9]'} rounded-[24px] font-bold text-2xl transition-all shadow-2xl hover:-translate-y-1 active:scale-95 overflow-hidden`}
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            {isDark ? 'Switch to Light' : 'Switch to Dark'} <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>

                    <div className="flex justify-center gap-8 pt-6">
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-orange-600">200k+</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#5D4F44]/50">Artifacts</span>
                        </div>
                        <div className="w-px h-12 bg-orange-200/50"></div>
                        <div className="text-center">
                            <span className="block text-3xl font-bold text-orange-600">5000</span>
                            <span className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-orange-100/40' : 'text-[#5D4F44]/50'}`}>Years of History</span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Footer */}
            <footer className={`py-12 px-6 border-t ${isDark ? 'bg-[#1A1614] border-orange-900/20' : 'bg-white border-orange-100/50'} text-center space-y-4`}>
                <div className="flex items-center justify-center gap-3 font-bold tracking-tight">
                    <Landmark size={24} className="text-orange-600" />
                    <span className="text-xl">MUSEUM AI</span>
                </div>
                <p className={`${isDark ? 'text-orange-100/40' : 'text-[#5D4F44]/60'} text-sm font-medium`}>
                    National Museum of India © 2026. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}
