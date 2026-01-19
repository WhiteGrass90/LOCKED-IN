import React, { useState, useEffect, useRef } from 'react';

interface HoldToQuitButtonProps {
  onQuit: () => void;
}

const HoldToQuitButton: React.FC<HoldToQuitButtonProps> = ({ onQuit }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(10000);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Initialize random duration on mount or when not holding
  // Range: 10s to 40s.
  // "Usually on the upper side" -> skew towards 40.
  // Formula: 40 - (30 * u^2) where u is random 0..1.
  // If u=0 (0% chance) -> 40s.
  // If u=1 (0% chance) -> 10s.
  // Because squaring a decimal makes it smaller, u^2 stays small, so (30*u^2) stays small, keeping result close to 40.
  const getSkewedDuration = () => {
    const u = Math.random();
    const skewed = Math.pow(u, 2); 
    const seconds = 40 - (30 * skewed); 
    return seconds * 1000;
  };

  const handleStart = () => {
    setDuration(getSkewedDuration());
    setIsHolding(true);
  };

  useEffect(() => {
    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      
      const newProgress = Math.min((elapsed / duration) * 100, 100); 

      setProgress(newProgress);

      if (newProgress < 100) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        onQuit();
        setIsHolding(false); 
      }
    };

    if (isHolding) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(0);
      startTimeRef.current = 0;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHolding, onQuit, duration]);

  return (
    <button
      className={`relative w-full py-6 px-4 rounded-xl border-2 border-red-900/50 bg-black text-red-500 overflow-hidden group select-none touch-none transition-all duration-300 ${isHolding ? 'scale-[0.98] border-red-600' : 'hover:border-red-700 hover:text-red-400'}`}
      onMouseDown={handleStart}
      onMouseUp={() => setIsHolding(false)}
      onMouseLeave={() => setIsHolding(false)}
      onTouchStart={handleStart}
      onTouchEnd={() => setIsHolding(false)}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserSelect: 'none' }}
    >
      <div 
        className="absolute inset-0 bg-red-600 transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
      <span className={`relative z-10 flex items-center justify-center gap-2 font-mono text-sm font-bold tracking-[0.2em] uppercase transition-colors ${progress > 50 ? 'text-white' : ''}`}>
        {isHolding ? "RESISTING..." : "HOLD TO FORFEIT"}
      </span>
    </button>
  );
};

export default HoldToQuitButton;