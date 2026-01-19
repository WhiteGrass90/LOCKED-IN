import React, { useEffect, useState } from 'react';

const StreakGrid: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lockIn_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Generate last 14 days for the visual grid
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i)); // Past 13 days + today
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex flex-col gap-2 items-center opacity-20 hover:opacity-40 transition-opacity duration-500">
      <div className="flex gap-1.5">
        {days.map((dateStr) => {
          const isCompleted = history.includes(dateStr);
          return (
            <div 
              key={dateStr}
              className={`w-3 h-3 rounded-sm border border-zinc-500 transition-all duration-300 ${isCompleted ? 'bg-vibe-purple border-vibe-purple shadow-[0_0_8px_rgba(167,139,250,0.6)]' : 'bg-transparent'}`}
              title={dateStr}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
        Focus History
      </span>
    </div>
  );
};

export default StreakGrid;
