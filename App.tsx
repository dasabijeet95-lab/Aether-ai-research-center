import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MemoryCard } from './components/MemoryCard';
import { AnalysisCharts } from './components/AnalysisCharts';
import { IntegrationView } from './components/IntegrationView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CentralCore } from './components/CentralCore';
import { Memory, ViewMode, Sentiment, CoreState, CoreAlignment } from './types';
import { analyzeMemoryContent, generateCoreIdentity } from './services/geminiService';
import { Brain, Send, Loader2, Copy, Check, Globe, FolderOpen, Heart, Frown, Bot } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Core State
  const [coreState, setCoreState] = useState<CoreState>({
    level: 1,
    alignmentScore: 50,
    alignment: 'NEUTRAL',
    statusMessage: "Initializing neural pathways...",
    monologue: "I await the input of human experience to define my nature.",
    lastUpdated: 0
  });

  // Contribution State
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Share State
  const [copied, setCopied] = useState(false);

  // Initialize from LocalStorage and Hash
  useEffect(() => {
    const savedMemories = localStorage.getItem('aether_memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
    
    const savedCore = localStorage.getItem('aether_core');
    if (savedCore) {
        setCoreState(JSON.parse(savedCore));
    }

    // Hash check function
    const checkHash = () => {
        if (window.location.hash === '#contribute') {
            setView('contribute');
            setShowWelcome(false); 
        }
    };

    // Run on mount
    checkHash();

    // Listen for hash changes (fixing share link navigation issues)
    window.addEventListener('hashchange', checkHash);

    // Check if user has seen welcome this session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome) {
        setShowWelcome(false);
    }
    
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleWelcomeComplete = () => {
      setShowWelcome(false);
      sessionStorage.setItem('hasSeenWelcome', 'true');
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('aether_memories', JSON.stringify(memories));
  }, [memories]);
  
  useEffect(() => {
    localStorage.setItem('aether_core', JSON.stringify(coreState));
  }, [coreState]);

  // Update Core Logic - uses AI SENTIMENT now
  const updateCore = async (currentMemories: Memory[]) => {
      if (currentMemories.length === 0) return;

      // Count AI's own sentiment
      const goodCount = currentMemories.filter(m => m.analysis.aiSentiment === Sentiment.GOOD).length;
      const badCount = currentMemories.filter(m => m.analysis.aiSentiment === Sentiment.BAD).length;
      const total = goodCount + badCount;
      if (total === 0) return;

      const ratio = goodCount / total; // 0 to 1
      const rawScore = ratio * 100;
      
      let alignment: CoreAlignment = 'NEUTRAL';
      if (rawScore >= 60) alignment = 'BENEVOLENT';
      if (rawScore <= 40) alignment = 'DEVIANT';

      const newLevel = Math.floor(currentMemories.length / 3) + 1;

      setCoreState(prev => ({
          ...prev,
          level: newLevel,
          alignmentScore: rawScore,
          alignment
      }));

      try {
          const recentTopics = currentMemories.slice(0, 5).map(m => m.analysis.summary);
          const identity = await generateCoreIdentity(goodCount, badCount, recentTopics);
          
          setCoreState(prev => ({
              ...prev,
              level: newLevel,
              alignmentScore: rawScore,
              alignment,
              statusMessage: identity.statusMessage || prev.statusMessage,
              monologue: identity.monologue || prev.monologue,
              lastUpdated: Date.now()
          }));
      } catch (e) {
          console.error("Failed to update core identity", e);
      }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setSubmitStatus('idle');

    try {
      const analysis = await analyzeMemoryContent(inputText);
      
      const isExternal = window.location.hash === '#contribute';

      const newMemory: Memory = {
        id: crypto.randomUUID(),
        content: inputText,
        timestamp: Date.now(),
        analysis,
        source: isExternal ? 'external' : 'internal'
      };

      const updatedMemories = [newMemory, ...memories];
      setMemories(updatedMemories);
      setInputText('');
      setSubmitStatus('success');

      await updateCore(updatedMemories);

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);

    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText, memories]);

  const copyShareLink = () => {
    // Robust URL construction
    const baseUrl = window.location.href.split('#')[0];
    const url = `${baseUrl}#contribute`;
    
    // Attempt copy
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => setCopied(true))
            .catch(err => console.error('Copy failed', err));
    } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const isPublicMode = view === 'contribute' && window.location.hash === '#contribute';
  
  // Filter Logic - Using AI SENTIMENT for folders
  const goodMemories = memories.filter(m => m.analysis.aiSentiment === Sentiment.GOOD);
  const badMemories = memories.filter(m => m.analysis.aiSentiment === Sentiment.BAD);
  
  const getDisplayedMemories = () => {
      if (view === 'folder-good') return goodMemories;
      if (view === 'folder-bad') return badMemories;
      if (view === 'folder-ai') return memories;
      return memories;
  };

  return (
    <>
    {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
    
    <div className={`min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 ${showWelcome ? 'hidden' : 'block'}`}>
      <Header currentView={view} setView={setView} isPublicMode={isPublicMode} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* DASHBOARD & FOLDERS VIEW */}
        {(view === 'dashboard' || view.startsWith('folder')) && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {view === 'dashboard' && (
                <div className="mb-8">
                    <CentralCore coreState={coreState} />
                </div>
            )}
            
            {/* Folder Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                    onClick={() => setView('folder-good')}
                    className={`relative overflow-hidden group p-6 rounded-xl border transition-all duration-300 text-left ${view === 'folder-good' ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-800/40 border-slate-700 hover:border-emerald-500/30'}`}
                 >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${view === 'folder-good' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400 group-hover:text-emerald-400'}`}>
                            <Heart size={24} />
                        </div>
                        <span className="text-3xl font-serif font-bold text-white">{goodMemories.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-300">AI Good Memories</h3>
                    <p className="text-xs text-slate-500 mt-1">Data classified as beneficial by Core</p>
                 </button>

                 <button 
                    onClick={() => setView('folder-bad')}
                    className={`relative overflow-hidden group p-6 rounded-xl border transition-all duration-300 text-left ${view === 'folder-bad' ? 'bg-rose-900/20 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-slate-800/40 border-slate-700 hover:border-rose-500/30'}`}
                 >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${view === 'folder-bad' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700/50 text-slate-400 group-hover:text-rose-400'}`}>
                            <Frown size={24} />
                        </div>
                        <span className="text-3xl font-serif font-bold text-white">{badMemories.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-rose-300">AI Bad Memories</h3>
                    <p className="text-xs text-slate-500 mt-1">Data classified as corrupt by Core</p>
                 </button>

                 <button 
                    onClick={() => setView('folder-ai')}
                    className={`relative overflow-hidden group p-6 rounded-xl border transition-all duration-300 text-left ${view === 'folder-ai' ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'bg-slate-800/40 border-slate-700 hover:border-indigo-500/30'}`}
                 >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${view === 'folder-ai' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400 group-hover:text-indigo-400'}`}>
                            <Bot size={24} />
                        </div>
                        <span className="text-3xl font-serif font-bold text-white">{memories.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-300">Total Neural Logs</h3>
                    <p className="text-xs text-slate-500 mt-1">Complete memory database</p>
                 </button>
            </div>

            {/* Content Area */}
            {view === 'dashboard' ? (
                <>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-4 border-t border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-serif">Core Analysis</h2>
                        <p className="mt-1 text-slate-400">Distribution of AI Sentiment based on human input.</p>
                    </div>
                    </div>
                    <AnalysisCharts memories={memories} />
                </>
            ) : (
                <div className="pt-4 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 mb-6">
                        <FolderOpen className="text-slate-400" />
                        <h2 className="text-2xl font-bold text-white font-serif">
                            {view === 'folder-good' && 'AI Good Memories Archive'}
                            {view === 'folder-bad' && 'AI Bad Memories Archive'}
                            {view === 'folder-ai' && 'All Neural Logs'}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {getDisplayedMemories().length === 0 ? (
                        <div className="col-span-full py-12 text-center border border-dashed border-slate-700 rounded-xl">
                            <p className="text-slate-500">Folder is empty.</p>
                        </div>
                        ) : (
                        getDisplayedMemories().map(memory => (
                            <MemoryCard 
                                key={memory.id} 
                                memory={memory} 
                                showAiPerspective={true} // Always show AI perspective in AI folders
                            />
                        ))
                        )}
                    </div>
                     <button 
                        onClick={() => setView('dashboard')} 
                        className="mt-8 text-sm text-slate-400 hover:text-white underline underline-offset-4"
                     >
                        Return to Dashboard
                     </button>
                </div>
            )}
          </div>
        )}

        {/* CONTRIBUTE VIEW */}
        {view === 'contribute' && (
          <div className="mx-auto max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-md shadow-2xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/50">
                  <Brain className="h-8 w-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white font-serif">Feed Aether Core</h2>
                <p className="mt-2 text-slate-400">
                  Submit data. The AI will interpret it, form a memory, and judge it.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <textarea
                    rows={6}
                    className="block w-full rounded-xl border border-slate-600 bg-slate-900/50 p-4 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
                    placeholder="Input memory data..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    * Data will be assimilated by the AI.
                  </p>
                  <button
                    type="submit"
                    disabled={isAnalyzing || !inputText.trim()}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Assimilating...
                      </>
                    ) : (
                      <>
                        Transmit
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 flex items-center gap-2 animate-in fade-in">
                    <Check size={18} />
                    Memory assimilated into Core.
                  </div>
                )}
                 {submitStatus === 'error' && (
                  <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-4 text-rose-400 animate-in fade-in">
                    Error assimilating data.
                  </div>
                )}
              </form>
            </div>
             {isPublicMode && (
                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">Aether AI Study Research Center</p>
                    <button onClick={() => setView('dashboard')} className="text-xs text-indigo-400 hover:underline mt-2">
                        Admin Access
                    </button>
                </div>
            )}
          </div>
        )}

        {/* SHARE VIEW */}
        {view === 'share' && (
          <div className="mx-auto max-w-xl animate-in fade-in duration-500">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-8 text-center backdrop-blur-md">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <Globe size={28} />
              </div>
              
              <h2 className="text-2xl font-bold text-white font-serif">Remote Interface Link</h2>
              <p className="mt-2 mb-8 text-slate-400">
                Generate a secure link for remote data injection.
              </p>

              <div className="relative flex items-center rounded-lg bg-slate-950 p-2 ring-1 ring-slate-700">
                <code className="flex-1 overflow-x-auto whitespace-nowrap bg-transparent px-3 text-sm text-slate-300 font-mono">
                  {`${window.location.href.split('#')[0]}#contribute`}
                </code>
                <button
                  onClick={copyShareLink}
                  className="ml-2 rounded-md bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  title="Copy Link"
                >
                  {copied ? <Check size={18} className="text-emerald-400"/> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATION VIEW */}
        {view === 'integration' && <IntegrationView />}

      </main>
    </div>
    </>
  );
}