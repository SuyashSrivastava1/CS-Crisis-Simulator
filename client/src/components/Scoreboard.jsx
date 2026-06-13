import React, { useEffect, useState } from 'react';
import './Scoreboard.css';

export default function Scoreboard({ score, streak }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (streak > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  return (
    <div className="scoreboard-container">
      <div className="score-badge">
        <span className="badge-label">SCORE</span>
        <span className="badge-value">{score}</span>
      </div>
      <div className={`streak-badge ${streak >= 3 ? 'on-fire' : ''} ${pulse ? 'pulse' : ''}`}>
        <span className="badge-label">STREAK</span>
        <span className="badge-value">
          🔥 {streak}
        </span>
      </div>
    </div>
  );
}
