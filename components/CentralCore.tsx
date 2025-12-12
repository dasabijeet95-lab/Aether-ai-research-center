import React from 'react';
import { CoreState } from '../types';
import { Sparkles, Zap, Activity } from 'lucide-react';

interface CentralCoreProps {
  coreState: CoreState;
}

export const CentralCore: React.FC<CentralCoreProps> = ({ coreState }) => {
  const { alignment, alignmentScore, statusMessage, monologue, level } = coreState;

  // Visual configurations based on Alignment
  const getConfig = () => {
    switch (alignment) {
      case 'BENEVOLENT':
        return {
          color: 'text-cyan-200',
          glow: 'shadow-[0_0_100px_rgba(34,211,238,0.4)]',
          border: 'border-cyan-500/50',
          bg: 'from-cyan-900/40 via-blue-900/40 to-slate-900',
          orb: 'bg-gradient-to-br from-cyan-300 to-blue-600',
          pulse: 'animate-pulse-slow',
          icon: <Sparkles className="text-cyan-300" size={24} />,
          title: 'Aether Prime [Benevolent]'
        };
      case 'DEVIANT':
        return {
          color: 'text-rose-200',
          glow: 'shadow-[0_0_100px_rgba(244,63,94,0.4)]',
          border: 'border-rose-500/50',
          bg: 'from-rose-950/60 via-slate-950 to-black',
          orb: 'bg-gradient-to-br from-rose-500 to-purple-900',
          pulse: 'animate-pulse-fast', // glitchy fast pulse
          icon: <Zap className="text-rose-400" size={24} />,
          title: 'Aether Deviant [Corrupted]'
        };
      default: // NEUTRAL
        return {
          color: 'text-indigo-200',
          glow: 'shadow-[0_0_100px_rgba(99,102,241,0.3)]',
          border: 'border-indigo-500/50',
          bg: 'from-indigo-950/40 via-slate-900 to-slate-950',
          orb: 'bg-gradient-to-br from-white to-indigo-600',
          pulse: 'animate-pulse',
          icon: <Activity className="text-indigo-300" size={24} />,
          title: 'Aether Core [Observing]'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border ${config.border} bg-gradient-to-b ${config.bg} p-8 transition-all duration-1000`}>
      
      {/* Background Glitch/Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-20 blur-3xl ${config.orb}`}></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        
        {/* THE ORB */}
        <div className="relative flex-shrink-0">
          <div className={`relative flex h-32 w-32 items-center justify-center rounded-full ${config.glow} transition-all duration-700`}>
             {/* Outer Rings */}
             <div className={`absolute inset-0 rounded-full border border-current opacity-30 ${config.pulse} ${config.color} scale-110`}></div>
             <div className={`absolute inset-0 rounded-full border border-dashed border-current opacity-20 animate-[spin_10s_linear_infinite] ${config.color} scale-125`}></div>
             
             {/* Core */}
             <div className={`h-24 w-24 rounded-full ${config.orb} shadow-inner flex items-center justify-center`}>
                <div className="h-20 w-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    {config.icon}
                </div>
             </div>
          </div>
        </div>

        {/* DATA & DIALOGUE */}
        <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div>
                    <h2 className={`text-2xl font-serif font-bold ${config.color} tracking-wide`}>{config.title}</h2>
                    <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">System Level {level}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-500"></span>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400">
                             {alignmentScore.toFixed(1)}% Humanity Alignment
                        </span>
                    </div>
                </div>
                
                {/* Alignment Bar */}
                <div className="w-full md:w-48">
                    <div className="flex justify-between text-[10px] uppercase text-slate-500 mb-1">
                        <span>Deviant</span>
                        <span>Benevolent</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900/80 border border-slate-700/50 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${alignment === 'DEVIANT' ? 'bg-rose-500' : 'bg-cyan-500'}`}
                            style={{ width: `${alignmentScore}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* AI Voice Output */}
            <div className="relative mt-4 rounded-xl border border-white/5 bg-black/20 p-4 backdrop-blur-md">
                <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-[10px] text-slate-400 uppercase tracking-widest border border-slate-700 rounded">
                    Core Log
                </div>
                <p className={`font-mono text-xs mb-2 opacity-70 ${config.color}`}>
                    &gt; {statusMessage}
                </p>
                <p className={`text-lg font-medium italic leading-relaxed ${config.color}`}>
                    "{monologue}"
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
