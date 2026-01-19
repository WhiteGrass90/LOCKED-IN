import React, { useEffect, useState } from 'react';

interface TimerProps {
  durationMinutes: number;
  onComplete: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ durationMinutes, onComplete, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const totalSeconds = durationMinutes * 60;
  
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onComplete]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalSeconds;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative flex items-center justify-center animate-float">
      <svg className="transform -rotate-90 w-72 h-72 md:w-96 md:h-96" viewBox="0 0 260 260">
        {/* Background circle */}
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-zinc-800"
        />
        {/* Progress circle */}
        <circle
          cx="130"
          cy="130"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-vibe-glow transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(167,139,250,0.5)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-6xl md:text-7xl font-mono font-light tracking-tighter text-white drop-shadow-lg">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default Timer;
