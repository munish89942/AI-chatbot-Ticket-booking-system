import React, { useState, useEffect } from 'react';
import { getBookings, getTickets, updateTicket } from '../services/api';
import { LayoutDashboard, Ticket, CalendarCheck, DollarSign, Users, TrendingUp, Settings, ChevronRight, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        if (activeTab === 'bookings') loadBookings();
        if (activeTab === 'tickets') loadTickets();
    }, [activeTab]);

    const loadBookings = () => getBookings().then(res => setBookings(res.data));
    const loadTickets = () => getTickets().then(res => setTickets(res.data));

    const handleUpdateTicket = async (id, price, limit) => {
        await updateTicket(id, { price, daily_limit: limit });
        loadTickets();
    };

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

    const navItems = [
        { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
        { id: 'tickets', label: 'Tickets & Pricing', icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-white/[0.06] bg-slate-950/90 backdrop-blur-xl flex flex-col h-screen sticky top-0">
                {/* Logo */}
                <div className="p-6 border-b border-white/[0.06]">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 bg-indigo-500/15 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-500/25 transition-colors">
                            <Landmark className="text-indigo-400" size={20} />
                        </div>
                        <span className="font-black tracking-tight text-white/90 text-sm">MUSEUM AI</span>
                    </Link>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xs text-emerald-400 font-semibold">Admin Panel</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                activeTab === id
                                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                            {activeTab === id && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                {/* Back to site */}
                <div className="p-4 border-t border-white/[0.06]">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                    >
                        <Settings size={18} />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'indigo' },
                        { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: 'emerald' },
                        { label: 'Ticket Types', value: tickets.length, icon: Ticket, color: 'purple' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex items-center gap-4`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-${color}-500/15 border border-${color}-500/20 flex items-center justify-center text-${color}-400`}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <p className="text-xs text-white/30 uppercase tracking-wider font-medium">{label}</p>
                                <p className="text-2xl font-black text-white">{value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <motion.div
                        key="bookings"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                            <CalendarCheck className="text-indigo-400" size={20} />
                            <h2 className="text-lg font-bold">Recent Bookings</h2>
                            <span className="ml-auto text-xs text-white/30 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full">
                                {bookings.length} total
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/[0.06] text-white/30 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 text-left font-semibold">ID</th>
                                        <th className="px-4 py-3 text-left font-semibold">Customer</th>
                                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                                        <th className="px-4 py-3 text-left font-semibold">Slot</th>
                                        <th className="px-4 py-3 text-left font-semibold">Tickets</th>
                                        <th className="px-4 py-3 text-left font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-white/20">
                                                No bookings yet.
                                            </td>
                                        </tr>
                                    ) : bookings.map(b => (
                                        <tr key={b.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-indigo-300/70 text-xs">#{b.id}</td>
                                            <td className="px-4 py-4 font-medium text-white/80">{b.customer_name}</td>
                                            <td className="px-4 py-4 text-white/50">{b.date}</td>
                                            <td className="px-4 py-4 text-white/50 text-xs">{b.slot_label}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(JSON.parse(b.ticket_details)).map(([k, v]) => (
                                                        <span key={k} className="text-xs px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">
                                                            {v}× {k}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 font-bold text-emerald-400">₹{b.total_price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Tickets Tab */}
                {activeTab === 'tickets' && (
                    <motion.div
                        key="tickets"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        {tickets.map(t => (
                            <div key={t.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 space-y-4 hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-black text-white">{t.name}</h3>
                                        <p className="text-xs text-white/30 mt-1 leading-relaxed">{t.description}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 whitespace-nowrap">
                                        ₹{t.price}
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                                    <label className="block">
                                        <span className="text-xs text-white/30 uppercase tracking-wider font-medium">Price (₹)</span>
                                        <input
                                            type="number"
                                            defaultValue={t.price}
                                            onBlur={(e) => handleUpdateTicket(t.id, e.target.value, t.daily_limit)}
                                            className="mt-1.5 w-full bg-white/[0.06] border border-white/[0.1] focus:border-indigo-500/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-xs text-white/30 uppercase tracking-wider font-medium">Daily Limit</span>
                                        <input
                                            type="number"
                                            defaultValue={t.daily_limit}
                                            onBlur={(e) => handleUpdateTicket(t.id, t.price, e.target.value)}
                                            className="mt-1.5 w-full bg-white/[0.06] border border-white/[0.1] focus:border-indigo-500/60 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
