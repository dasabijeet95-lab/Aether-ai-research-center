import React, { useEffect, useState } from 'react';
import { Orbit } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 2500);
    const t3 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] text-white">
      <div className={`transition-all duration-1000 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20 duration-1000"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-indigo-950 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                <Orbit className="h-10 w-10 text-indigo-400 animate-spin-slow" />
            </div>
        </div>
      </div>
      
      <div className={`text-center transition-all duration-1000 delay-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl font-bold tracking-tighter font-serif bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">
          AETHER AI
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-indigo-400">Research Center</p>
      </div>

      <div className={`mt-8 flex flex-col items-center gap-2 transition-all duration-500 delay-700 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <p className="text-xs text-slate-500">Initializing Neural Links...</p>
      </div>
    </div>
  );
};
