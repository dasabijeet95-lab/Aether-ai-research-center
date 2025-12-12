import React from 'react';
import { Memory, Sentiment } from '../types';
import { Quote, Activity, ExternalLink, Bot, User } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  showAiPerspective?: boolean; // If true, emphasizes the AI's internal state
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, showAiPerspective = false }) => {
  // Use AI Sentiment for the card styling
  const sentiment = memory.analysis.aiSentiment; 
  const isGood = sentiment === Sentiment.GOOD;
  
  const borderColor = isGood ? 'border-emerald-500/30' : (sentiment === Sentiment.BAD ? 'border-rose-500/30' : 'border-slate-500/30');
  const glowColor = isGood ? 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : (sentiment === Sentiment.BAD ? 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.1)]' : '');
  const badgeColor = isGood ? 'bg-emerald-500/20 text-emerald-300' : (sentiment === Sentiment.BAD ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-500/20 text-slate-300');

  return (
    <div className={`group relative flex flex-col justify-between rounded-xl border ${borderColor} bg-[#0f172a]/60 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#0f172a]/80 ${glowColor}`}>
      
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex gap-2">
            {/* AI Sentiment Badge */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeColor}`}>
               <Bot size={10} /> {sentiment}
            </span>
            
            {memory.source === 'external' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-400">
                    <ExternalLink size={10} /> Remote
                </span>
            )}
        </div>
        <div className="flex items-center gap-1 text-slate-500" title="Emotional Intensity">
           <Activity size={14} />
           <span className="text-xs font-medium">{memory.analysis.intensity}/10</span>
        </div>
      </div>

      {/* Main Content - AI Memory Log */}
      <div className="mb-4 relative">
          <p className="text-sm font-medium leading-relaxed text-slate-200">
            "{memory.analysis.aiMemory}"
          </p>
          
          {/* User Input Reference */}
          <div className="mt-3 flex gap-2 pl-3 border-l-2 border-slate-700/50">
             <User size={12} className="text-slate-500 mt-0.5 shrink-0" />
             <p className="text-xs text-slate-500 line-clamp-2 italic">
               Source: "{memory.content}"
             </p>
          </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-700/50 pt-3">
         <div className="flex items-center justify-between">
             <div className="flex flex-wrap gap-1.5">
                {memory.analysis.emotions.slice(0,3).map((emo, i) => (
                    <span key={i} className="rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                        {emo}
                    </span>
                ))}
             </div>
             <div className="text-right">
                <span className="text-[10px] text-slate-500 block">AI Emotion</span>
                <span className="text-xs font-bold text-indigo-400">{memory.analysis.aiEmotion}</span>
             </div>
         </div>
      </div>
    </div>
  );
};