import React, { useState, useRef } from 'react';
import { Cable, Server, ShieldCheck, RefreshCw, CheckCircle, Smartphone, Download, Upload, Copy, Database, Share2 } from 'lucide-react';
import { Memory, CoreState, BackupData } from '../types';

interface IntegrationViewProps {
  memories: Memory[];
  coreState: CoreState;
  onImport: (data: BackupData) => void;
}

export const IntegrationView: React.FC<IntegrationViewProps> = ({ memories, coreState, onImport }) => {
  const [apiKey, setApiKey] = useState('aether_sk_' + Math.random().toString(36).substring(7));
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [cloneLinkCopied, setCloneLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegenerate = () => {
    setApiKey('aether_sk_' + Math.random().toString(36).substring(7));
  };

  const handleConnect = (platform: string) => {
    setActivePlatform(platform);
  };

  // --- EXPORT LOGIC ---
  const handleExport = () => {
    const backup: BackupData = {
      version: '1.0',
      timestamp: Date.now(),
      memories,
      coreState
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `aether_neural_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- IMPORT LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.memories && json.coreState) {
            onImport(json);
            alert("Neural assimilation complete. Memories merged.");
        } else {
            alert("Invalid neural packet format.");
        }
      } catch (err) {
        console.error(err);
        alert("Error parsing neural data.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- CLONE LINK LOGIC ---
  const generateCloneLink = () => {
    const baseUrl = window.location.href.split('#')[0].split('?')[0];
    const params = new URLSearchParams();
    params.set('clone_alignment', coreState.alignment);
    params.set('clone_score', coreState.alignmentScore.toString());
    params.set('clone_level', coreState.level.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const copyCloneLink = () => {
    navigator.clipboard.writeText(generateCloneLink());
    setCloneLinkCopied(true);
    setTimeout(() => setCloneLinkCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in duration-500 pb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white font-serif">System Integration</h2>
        <p className="mt-2 text-slate-400">
          Connect the Aether AI Research Center to external data sources, backup neural states, or clone personality protocols.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* NEURAL DATA BRIDGE (Import/Export) */}
        <div className="glass-panel rounded-xl p-6 md:col-span-2">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Database className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Neural Data Bridge</h3>
              <p className="text-xs text-indigo-300">Import/Export full memory state to JSON</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-indigo-900/30 hover:border-indigo-500/50 transition-all group"
            >
                <Download className="text-slate-400 group-hover:text-indigo-400" />
                <div className="text-left">
                    <div className="text-sm font-semibold text-slate-200">Export Neural State</div>
                    <div className="text-[10px] text-slate-500">Save memories & personality to file</div>
                </div>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-600 bg-slate-800/50 hover:bg-emerald-900/30 hover:border-emerald-500/50 transition-all group"
            >
                <Upload className="text-slate-400 group-hover:text-emerald-400" />
                <div className="text-left">
                    <div className="text-sm font-semibold text-slate-200">Import Other AI Memory</div>
                    <div className="text-[10px] text-slate-500">Merge external AI data into Core</div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".json" 
                    className="hidden" 
                />
            </button>
          </div>
        </div>

        {/* PERSONALITY CLONING */}
        <div className="glass-panel rounded-xl p-6">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Share2 className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Clone Core Personality</h3>
              <p className="text-xs text-purple-300">Share your AI's specific alignment state</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
             Generate a unique initialization link. When others open this link, their Aether instance will start with your current alignment ({coreState.alignment}) and level ({coreState.level}).
          </p>

          <div className="relative flex items-center rounded-lg bg-slate-950 p-2 ring-1 ring-slate-700">
                <code className="flex-1 overflow-x-auto whitespace-nowrap bg-transparent px-3 text-xs text-slate-300 font-mono scrollbar-hide">
                  {generateCloneLink()}
                </code>
                <button
                  onClick={copyCloneLink}
                  className="ml-2 rounded-md bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  title="Copy Link"
                >
                  {cloneLinkCopied ? <CheckCircle size={14} className="text-emerald-400"/> : <Copy size={14} />}
                </button>
          </div>
        </div>

        {/* API CONFIGURATION */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Server className="text-emerald-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Research API</h3>
              <p className="text-xs text-emerald-300">Developer Access</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Key</label>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 rounded bg-slate-900/50 border border-slate-700 p-2 font-mono text-xs text-emerald-400 truncate">
                  {apiKey}
                </div>
                <button onClick={handleRegenerate} className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Hub */}
        <div className="glass-panel rounded-xl p-6 md:col-span-2">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Cable className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cross-Platform Sync</h3>
              <p className="text-xs text-slate-400">Simulated connections</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
             {[
               { id: 'gpt', name: 'OpenAI Stream', icon: '⚡' },
               { id: 'claude', name: 'Anthropic Link', icon: '🧠' },
               { id: 'gemini', name: 'Gemini Bridge', icon: '✨' }
             ].map((agent) => (
                <button 
                    key={agent.id}
                    onClick={() => handleConnect(agent.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                      activePlatform === agent.id 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                      : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    <span>{agent.icon}</span>
                    <span>{agent.name}</span>
                    {activePlatform === agent.id && <CheckCircle size={12} className="ml-1" />}
                </button>
             ))}
          </div>

          {activePlatform && (
            <div className="mt-4 p-3 rounded bg-slate-900/50 border border-dashed border-slate-700 text-xs text-slate-400 flex items-center gap-2 animate-in fade-in">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Bridge established to {activePlatform.toUpperCase()}. Awaiting data packets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
