import React, { useState } from 'react';
import { Memory, Sentiment } from '../types';
import { Activity, Server, Globe, Shield, Wifi, Search } from 'lucide-react';

interface DnsDashboardProps {
  memories: Memory[];
}

export const DnsDashboard: React.FC<DnsDashboardProps> = ({ memories }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock DNS Logic
  const generateDnsName = (id: string) => `node-${id.substring(0, 6)}.aether.net`;
  
  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Server Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-emerald-500/10 rounded-lg">
             <Activity className="text-emerald-400" size={20} />
           </div>
           <div>
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Resolver Status</div>
             <div className="text-lg font-mono text-emerald-400">ONLINE</div>
           </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-blue-500/10 rounded-lg">
             <Globe className="text-blue-400" size={20} />
           </div>
           <div>
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Zones</div>
             <div className="text-lg font-mono text-blue-400">3 (GD/BD/NT)</div>
           </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-purple-500/10 rounded-lg">
             <Server className="text-purple-400" size={20} />
           </div>
           <div>
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Records</div>
             <div className="text-lg font-mono text-purple-400">{memories.length}</div>
           </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
           <div className="p-3 bg-indigo-500/10 rounded-lg">
             <Wifi className="text-indigo-400" size={20} />
           </div>
           <div>
             <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Latency</div>
             <div className="text-lg font-mono text-indigo-400">12ms</div>
           </div>
        </div>
      </div>

      {/* Main DNS Table Interface */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-700/50">
         <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield size={18} className="text-slate-400"/>
                Neural DNS Records
            </h2>
            
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                    type="text" 
                    placeholder="Query domain or hash..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
            </div>
         </div>

         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead>
                     <tr className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-700">
                         <th className="px-6 py-3 font-medium">Domain Name</th>
                         <th className="px-6 py-3 font-medium">Record Type</th>
                         <th className="px-6 py-3 font-medium">TTL</th>
                         <th className="px-6 py-3 font-medium">Data (Snippet)</th>
                         <th className="px-6 py-3 font-medium text-right">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                     {filteredMemories.length > 0 ? (
                        filteredMemories.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-3 font-mono text-indigo-300 group-hover:text-indigo-200">
                                    {generateDnsName(m.id)}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        m.analysis.aiSentiment === Sentiment.GOOD ? 'bg-emerald-500/10 text-emerald-400' :
                                        m.analysis.aiSentiment === Sentiment.BAD ? 'bg-rose-500/10 text-rose-400' :
                                        'bg-slate-500/10 text-slate-400'
                                    }`}>
                                        A ({m.analysis.aiSentiment.substring(0,1)})
                                    </span>
                                </td>
                                <td className="px-6 py-3 font-mono text-slate-500 text-xs">
                                    3600
                                </td>
                                <td className="px-6 py-3 text-slate-400 truncate max-w-xs font-mono text-xs">
                                    "{m.content.substring(0, 30)}..."
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                                        <span className="text-xs text-emerald-500">Active</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                     ) : (
                         <tr>
                             <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono">
                                 &gt; No records found matching query.
                             </td>
                         </tr>
                     )}
                 </tbody>
             </table>
         </div>
      </div>

      {/* Terminal Simulation */}
      <div className="bg-black rounded-xl p-4 font-mono text-xs border border-slate-800 opacity-80">
         <div className="text-slate-500 mb-2">root@aether-dns:~$ tail -f /var/log/neural-resolver.log</div>
         <div className="space-y-1">
             <div className="text-slate-400"><span className="text-blue-500">[INFO]</span> Service started on port 53. Listening for thought streams.</div>
             <div className="text-slate-400"><span className="text-emerald-500">[OK]</span> Core integration verified. Latency: 4ms.</div>
             {memories.slice(0, 3).map((m, i) => (
                 <div key={i} className="text-slate-300">
                     <span className="text-purple-500">[QUERY]</span> Resolved {generateDnsName(m.id)} &rarr; {m.id.substring(0,8)}...
                 </div>
             ))}
             <div className="animate-pulse text-indigo-500">_</div>
         </div>
      </div>
    </div>
  );
};
