import React, { useState, useEffect } from 'react';
import { AppState, FocusSession } from './types';
import { getMotivationalMessage, getInterventionMessage, getCompletionMessage } from './services/geminiService';
import Timer from './components/Timer';
import GrainOverlay from './components/GrainOverlay';
import HoldToQuitButton from './components/HoldToQuitButton';
import StreakGrid from './components/StreakGrid';
import { Play, Pause, RefreshCw, Check, X } from 'lucide-react';

// Icons using lucide-react (simulated import, assume environment has it or use SVGs directly if preferred)
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [session, setSession] = useState<FocusSession>({
    intent: "Quit Instagram", 
    durationMinutes: 45
  });
  const [coachMessage, setCoachMessage] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

  // Setup initial message
  useEffect(() => {
    // Optional: could fetch an initial greeting
  }, []);

  const startSession = async () => {
    setLoadingMessage(true);
    setAppState(AppState.FOCUSING);
    const msg = await getMotivationalMessage(session.intent, session.durationMinutes);
    setCoachMessage(msg);
    setLoadingMessage(false);
  };

  const triggerIntervention = async () => {
    setAppState(AppState.INTERVENTION);
    setLoadingMessage(true);
    // Use the existing intent for a personalized check
    const msg = await getInterventionMessage(session.intent);
    setCoachMessage(msg);
    setLoadingMessage(false);
  };

  const resolveIntervention = (stay: boolean) => {
    if (stay) {
      setAppState(AppState.FOCUSING);
      setCoachMessage("good choice. stay locked in.");
    } else {
      setAppState(AppState.SETUP);
      setCoachMessage("resetting. try again when you're ready.");
    }
  };

  const handleComplete = async () => {
    setAppState(AppState.COMPLETED);
    
    // Save to history
    try {
      const today = new Date().toISOString().split('T')[0];
      const history = JSON.parse(localStorage.getItem('lockIn_history') || '[]');
      if (!history.includes(today)) {
        history.push(today);
        localStorage.setItem('lockIn_history', JSON.stringify(history));
      }
    } catch (e) {
      console.error("Failed to save history", e);
    }

    setLoadingMessage(true);
    const msg = await getCompletionMessage(session.intent);
    setCoachMessage(msg);
    setLoadingMessage(false);
  };

  const handleReset = () => {
    setAppState(AppState.SETUP);
    setSession({ intent: "Quit Instagram", durationMinutes: 45 });
    setCoachMessage("");
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-red-900 selection:text-white flex flex-col relative overflow-hidden transition-colors duration-1000 ${appState === AppState.INTERVENTION ? 'bg-black' : 'bg-vibe-dark text-zinc-100'}`}>
      <GrainOverlay />
      
      {/* Dynamic Backgrounds */}
      {appState === AppState.INTERVENTION ? (
        <>
          {/* Red Siren Background */}
          <div className="absolute inset-0 bg-red-900/30 animate-siren pointer-events-none z-0" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(220,38,38,0.5)] z-0 pointer-events-none" />
        </>
      ) : (
        <>
          {/* Default Vibe Background */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-vibe-purple/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10 opacity-70">
        <div className={`text-sm font-mono tracking-widest uppercase ${appState === AppState.INTERVENTION ? 'text-red-500' : 'text-zinc-500'}`}>
          Lock In /// Protocol
        </div>
        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${appState === AppState.INTERVENTION ? 'bg-red-600 shadow-red-500' : 'bg-green-500 shadow-green-500'}`}></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full max-w-2xl mx-auto">
        
        {/* Setup Screen */}
        {appState === AppState.SETUP && (
          <div className="flex flex-col gap-12 w-full animate-[fadeIn_0.5s_ease-out]">
            <div className="space-y-2 text-center">
              <h1 className="text-4xl md:text-6xl font-medium tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Disconnect to Reconnect.
              </h1>
              <p className="text-zinc-400 text-lg">
                What are we avoiding today?
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 uppercase ml-1">Objective</label>
                <input 
                  type="text" 
                  value={session.intent}
                  onChange={(e) => setSession({...session, intent: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-4 text-xl focus:outline-none focus:border-vibe-purple focus:ring-1 focus:ring-vibe-purple transition-all placeholder-zinc-700"
                  placeholder="e.g. Quit Instagram"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 uppercase ml-1">Duration (Minutes)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    step="5"
                    value={session.durationMinutes}
                    onChange={(e) => setSession({...session, durationMinutes: parseInt(e.target.value)})}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-vibe-purple"
                  />
                  <span className="font-mono text-xl w-16 text-right">{session.durationMinutes}m</span>
                </div>
              </div>

              <button 
                onClick={startSession}
                className="group mt-4 relative w-full bg-white text-black font-semibold py-4 rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-0 group-hover:opacity-50 transition-opacity transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                <span className="flex items-center justify-center gap-2">
                  INITIATE LOCK IN <ArrowRightIcon />
                </span>
              </button>
            </div>
            
            {/* Faded Streak Grid */}
            <div className="mt-8 flex justify-center w-full">
              <StreakGrid />
            </div>
          </div>
        )}

        {/* Active Session (Focusing) */}
        {appState === AppState.FOCUSING && (
           <div className="flex flex-col items-center w-full gap-8 md:gap-12 animate-[fadeIn_0.5s_ease-out]">
             <div className="h-24 flex items-center justify-center text-center w-full max-w-lg">
                {loadingMessage ? (
                   <span className="text-zinc-600 animate-pulse">thinking...</span>
                ) : (
                  <p className="text-lg md:text-xl font-light leading-relaxed text-zinc-300">
                    "{coachMessage}"
                  </p>
                )}
             </div>
             <div className="transition-all duration-500 opacity-100">
                <Timer 
                  durationMinutes={session.durationMinutes} 
                  onComplete={handleComplete}
                  isPaused={false}
                />
             </div>
             <div className="flex flex-col gap-4 items-center">
                 <p className="text-sm font-mono text-zinc-600 uppercase tracking-widest animate-pulse">
                   Focus Mode Active
                 </p>
                 <button 
                  onClick={triggerIntervention}
                  className="mt-8 text-zinc-500 hover:text-red-400 text-sm border border-zinc-800 hover:border-red-900 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                 >
                   <AlertIcon /> I'm tempted to scroll
                 </button>
              </div>
           </div>
        )}

        {/* Intervention State (Red Siren Mode) */}
        {appState === AppState.INTERVENTION && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center space-y-12 animate-[fadeIn_0.2s_ease-out] w-full max-w-md mx-auto">
            
            <div className="space-y-6">
               <div className="w-20 h-20 rounded-full bg-red-950/50 border border-red-800/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-bounce">
                  <LockIcon />
               </div>
               
               {/* Single Message Displayed Above Button */}
               <h2 className="text-2xl md:text-3xl font-bold text-red-100 leading-tight tracking-tight drop-shadow-md">
                 {coachMessage || "remember why you started."}
               </h2>
               
               <p className="text-red-300/60 text-sm font-mono uppercase tracking-widest">
                  Lockdown Protocol Active
               </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full pt-4">
              <button 
                onClick={() => resolveIntervention(true)}
                className="w-full py-5 px-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                I'M STAYING
              </button>
              
              <div className="pt-4 w-full">
                  <HoldToQuitButton 
                    onQuit={() => resolveIntervention(false)} 
                  />
              </div>
            </div>
          </div>
        )}

        {/* Completion Screen */}
        {appState === AppState.COMPLETED && (
           <div className="flex flex-col items-center text-center gap-8 animate-[fadeIn_0.8s_ease-out]">
             <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-4 ring-1 ring-green-500/30">
                <CheckIcon />
             </div>
             <h2 className="text-4xl font-semibold text-white">Session Complete.</h2>
             <p className="text-xl text-zinc-400 max-w-md italic">
               "{coachMessage}"
             </p>
             <div className="h-px w-24 bg-zinc-800 my-4" />
             <p className="text-zinc-500 text-sm font-mono">
               45 minutes reclaimed from the algorithm.
             </p>
             <button 
               onClick={handleReset}
               className="mt-8 bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl border border-zinc-800 transition-all"
             >
               Start New Session
             </button>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-zinc-700 text-xs font-mono opacity-50 z-10">
        AI FOCUS COACH // V1.0
      </footer>
    </div>
  );
}
