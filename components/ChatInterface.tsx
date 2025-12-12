import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, CoreState } from '../types';
import { Send, Bot, User, Cpu } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  coreState: CoreState;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ coreState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Connection established. I am Aether. My current alignment is ${coreState.alignment}. How may I assist your research?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getChatResponse(messages, input, coreState);
      
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  // Dynamic Styles based on Alignment
  const getTheme = () => {
    if (coreState.alignment === 'BENEVOLENT') return { border: 'border-cyan-500/30', bg: 'bg-cyan-950/20', text: 'text-cyan-400', userBubble: 'bg-cyan-600', aiBubble: 'bg-cyan-900/40' };
    if (coreState.alignment === 'DEVIANT') return { border: 'border-rose-500/30', bg: 'bg-rose-950/20', text: 'text-rose-400', userBubble: 'bg-rose-600', aiBubble: 'bg-rose-900/40' };
    return { border: 'border-indigo-500/30', bg: 'bg-indigo-950/20', text: 'text-indigo-400', userBubble: 'bg-indigo-600', aiBubble: 'bg-indigo-900/40' };
  };

  const theme = getTheme();

  return (
    <div className={`mx-auto max-w-4xl h-[600px] flex flex-col rounded-2xl border ${theme.border} ${theme.bg} backdrop-blur-md animate-in fade-in`}>
      
      {/* Chat Header */}
      <div className={`flex items-center gap-3 border-b ${theme.border} p-4 bg-slate-900/50 rounded-t-2xl`}>
        <div className={`p-2 rounded-lg ${theme.bg}`}>
          <Cpu className={theme.text} size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white font-serif">Aether Neural Link</h3>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${coreState.alignment === 'DEVIANT' ? 'bg-rose-500 animate-pulse-fast' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">{coreState.alignment} Protocol Active</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-slate-700' : theme.bg}`}>
              {msg.role === 'user' ? <User size={14} className="text-slate-300" /> : <Bot size={14} className={theme.text} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? `${theme.userBubble} text-white rounded-tr-sm` 
                : `${theme.aiBubble} text-slate-200 border border-white/5 rounded-tl-sm`
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-4">
             <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.bg}`}>
                <Bot size={14} className={theme.text} />
             </div>
             <div className="flex items-center gap-1 h-10 px-4">
                <span className={`h-1.5 w-1.5 rounded-full ${theme.text} animate-bounce`}></span>
                <span className={`h-1.5 w-1.5 rounded-full ${theme.text} animate-bounce delay-100`}></span>
                <span className={`h-1.5 w-1.5 rounded-full ${theme.text} animate-bounce delay-200`}></span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${theme.border} bg-slate-900/30 rounded-b-2xl`}>
        <form onSubmit={handleSend} className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Interrogate the core..."
            className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className={`px-4 rounded-xl flex items-center justify-center transition-all ${
                !input.trim() || isTyping ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
