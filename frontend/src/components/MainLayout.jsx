import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Trophy, 
  Archive, 
  Settings, 
  User, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Users, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isSimulation = location.pathname === '/simulation';

  return (
    <div className="flex min-h-screen bg-[#06060e] text-slate-200 overflow-hidden font-sans">
      {/* 🌌 Tactical Sidebar */}
      <aside className="w-64 bg-[#090915] border-r border-white/5 flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#bc13fe] to-[#00f2ff] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(188,19,254,0.3)]">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">CODENYNX</h1>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4 px-3">Operations</p>
            <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink to="/simulation" icon={Zap} label="Simulate" />
            <SidebarLink to="/leaderboard" icon={Trophy} label="Leaderboard" />
            <SidebarLink to="/archive" icon={Archive} label="Archive" />
          </nav>

          <div className="mt-10 pt-10 border-t border-white/5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-4 px-3">System HUD</p>
            <SidebarLink to="#" icon={Terminal} label="Core HUD" active={isSimulation} />
            <SidebarLink to="#" icon={Activity} label="Impact Stats" />
            <SidebarLink to="#" icon={ShieldAlert} label="Risk Matrix" />
            <SidebarLink to="#" icon={Users} label="Trust Meter" />
          </div>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button className="w-full py-4 bg-gradient-to-r from-[#bc13fe] to-[#7d12ff] rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(188,19,254,0.2)] hover:scale-105 transition-transform active:scale-95">
            Initiate Protocol
          </button>
          
          <div className="flex items-center justify-between px-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2 hover:text-slate-300 cursor-pointer">
              <Terminal size={12} /> System Log
            </div>
            <div className="flex items-center gap-2 hover:text-red-400 cursor-pointer">
              <LogOut size={12} /> Exit
            </div>
          </div>
        </div>
      </aside>

      {/* 🏙️ Main Content Window */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#090915]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span className="text-indigo-400">Main</span> 
            <ChevronRight size={12} /> 
            <span className="text-white">{location.pathname.replace('/', '') || 'Entry'}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">System Nominal</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <User size={24} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {/* Global Scan Line Background Effect */}
           <div className="scan-line" />
           
           <div className="max-w-7xl mx-auto">
            {children}
           </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, label, active = false }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
        ${(isActive || active) 
          ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-2 border-indigo-500 shadow-[20px_0_40px_rgba(79,70,229,0.1)]' 
          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent'}
      `}
    >
      <Icon className={`w-5 h-5 ${(active) ? 'text-indigo-400' : ''}`} />
      <span className="text-sm font-bold tracking-wide">{label}</span>
      {(active) && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full" 
        />
      )}
    </NavLink>
  );
};

export default MainLayout;
