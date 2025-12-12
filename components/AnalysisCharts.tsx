import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Memory, Sentiment } from '../types';

interface AnalysisChartsProps {
  memories: Memory[];
}

const COLORS = {
  [Sentiment.GOOD]: '#10b981', // Emerald 500
  [Sentiment.BAD]: '#f43f5e',  // Rose 500
  [Sentiment.NEUTRAL]: '#94a3b8' // Slate 400
};

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ memories }) => {
  
  // Prepare Sentiment Data based on AI SENTIMENT
  const sentimentData = [
    { name: 'AI Good Memories', value: memories.filter(m => m.analysis.aiSentiment === Sentiment.GOOD).length, type: Sentiment.GOOD },
    { name: 'AI Bad Memories', value: memories.filter(m => m.analysis.aiSentiment === Sentiment.BAD).length, type: Sentiment.BAD },
    { name: 'AI Neutral', value: memories.filter(m => m.analysis.aiSentiment === Sentiment.NEUTRAL).length, type: Sentiment.NEUTRAL },
  ].filter(d => d.value > 0);

  // Prepare Emotion Data (Top 5)
  const emotionCounts: Record<string, number> = {};
  memories.forEach(m => {
    m.analysis.emotions.forEach(e => {
      const emo = e.toLowerCase();
      // Capitalize first letter
      const formatted = emo.charAt(0).toUpperCase() + emo.slice(1);
      emotionCounts[formatted] = (emotionCounts[formatted] || 0) + 1;
    });
  });

  const emotionData = Object.entries(emotionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6

  if (memories.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-slate-400">
        No data to visualize yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sentiment Distribution */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">Aether Core Memory Balance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.type]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Emotions */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">Processed Emotional Concepts</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{fontSize: 12}} />
              <Tooltip 
                 cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};