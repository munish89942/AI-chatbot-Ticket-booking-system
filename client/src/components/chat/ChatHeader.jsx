import React, { useEffect, useState } from 'react';
import { Building2, MessageCircle, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMuseumInfo } from '../../services/api';

export default function ChatHeader() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        getMuseumInfo().then(res => setInfo(res.data)).catch(console.error);
    }, []);

    const museumName = info?.museum_name || 'Luxe Museum';

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b bg-white/5 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
                    <Building2 className="text-indigo-400" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight gradient-text">{museumName.toUpperCase()}</span>
            </Link>

            <div className="flex items-center gap-4">
                <Link to="/about" className="hidden sm:block text-white/70 hover:text-white font-medium transition-colors">
                    About
                </Link>
                <Link to="/chat" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 scale-100 active:scale-95">
                    <MessageCircle size={18} />
                    <span>Book Tickets</span>
                </Link>
                <Link to="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-semibold transition-all">
                    <Settings size={18} />
                    <span>Admin</span>
                </Link>
                <button className="sm:hidden p-2 text-white/70 hover:text-white">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}
