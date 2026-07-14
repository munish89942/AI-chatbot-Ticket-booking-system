import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';
import AboutPage from './components/AboutPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
