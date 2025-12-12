import React from 'react';
import { Orbit, Plus, Share2, LayoutDashboard, Database, Cable } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  isPublicMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, isPublicMode = false }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-indigo-900/50 bg-[#020617]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => !isPublicMode && setView('dashboard')}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-950/50 ring-1 ring-indigo-500/30 transition-all group-hover:ring-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Orbit className="text-indigo-400 animate-spin-slow" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100 font-serif">Aether AI</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-indigo-400">Study Research Center</p>
          </div>
        </div>

        {!isPublicMode && (
          <nav className="flex items-center gap-2 sm:gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'dashboard' || currentView.startsWith('folder') ? 'bg-indigo-900/50 text-indigo-100 ring-1 ring-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Research</span>
            </button>
            <button
              onClick={() => setView('contribute')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'contribute' ? 'bg-indigo-900/50 text-indigo-100 ring-1 ring-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Collect</span>
            </button>
            <button
              onClick={() => setView('integration')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'integration' ? 'bg-indigo-900/50 text-indigo-100 ring-1 ring-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cable size={16} />
              <span className="hidden sm:inline">Integration</span>
            </button>
            <button
              onClick={() => setView('share')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                currentView === 'share' ? 'bg-indigo-900/50 text-indigo-100 ring-1 ring-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};