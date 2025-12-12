import React, { useState } from 'react';
import { Cable, Server, ShieldCheck, RefreshCw, CheckCircle, Smartphone } from 'lucide-react';

export const IntegrationView: React.FC = () => {
  const [apiKey, setApiKey] = useState('aether_sk_' + Math.random().toString(36).substring(7));
  const [isConnected, setIsConnected] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const handleRegenerate = () => {
    setApiKey('aether_sk_' + Math.random().toString(36).substring(7));
  };

  const handleConnect = (platform: string) => {
    setActivePlatform(platform);
    setIsConnected(true);
  };

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white font-serif">System Integration</h2>
        <p className="mt-2 text-slate-400">
          Connect the Aether AI Research Center to external AI agents and data collection points.
          This interface enables server-grade consistency while maintaining client-side sovereignty.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration Panel */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Server className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Local Relay Server</h3>
              <p className="text-xs text-indigo-300">Status: <span className="text-emerald-400">Active (Client-side)</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Endpoint URL</label>
              <div className="mt-1 flex items-center rounded bg-slate-900/50 border border-slate-700 p-2 font-mono text-xs text-slate-300">
                {window.location.origin}/api/v1/memories/collect
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Research API Key</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 rounded bg-slate-900/50 border border-slate-700 p-2 font-mono text-xs text-emerald-400">
                  {apiKey}
                </div>
                <button onClick={handleRegenerate} className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded bg-indigo-900/20 p-3 text-xs text-indigo-200 border border-indigo-500/20">
            <ShieldCheck size={16} className="shrink-0 mt-0.5" />
            <p>Secure connection enabled. All memories flow directly to your local research database.</p>
          </div>
        </div>

        {/* Integration Hub */}
        <div className="glass-panel rounded-xl p-6">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Cable className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">External Agents</h3>
              <p className="text-xs text-slate-400">Authorize other AIs to contribute</p>
            </div>
          </div>

          <div className="space-y-3">
             {[
               { id: 'gpt', name: 'OpenAI GPT-4 Relay', icon: '⚡' },
               { id: 'claude', name: 'Anthropic Claude Link', icon: '🧠' },
               { id: 'gemini', name: 'Google Gemini Stream', icon: '✨' }
             ].map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{agent.icon}</span>
                    <span className="text-sm font-medium text-slate-200">{agent.name}</span>
                  </div>
                  <button 
                    onClick={() => handleConnect(agent.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                      activePlatform === agent.id 
                      ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50' 
                      : 'bg-slate-700 hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {activePlatform === agent.id ? 'Connected' : 'Connect'}
                  </button>
                </div>
             ))}
          </div>

          {activePlatform && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="flex items-center justify-center p-4 border border-dashed border-slate-600 rounded-lg bg-slate-900/30">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle size={16} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">Integration Active</p>
                    <p className="text-xs text-slate-500 mt-1">Listening for incoming memory packets...</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Integration Note */}
      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/30 p-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
            <Smartphone size={20} />
        </div>
        <div>
            <h4 className="text-sm font-semibold text-white">App-to-App Integration</h4>
            <p className="text-xs text-slate-400">Use the Share link to manually bridge data from mobile apps like WhatsApp or Telegram.</p>
        </div>
      </div>
    </div>
  );
};
