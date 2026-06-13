import React, { useState, useEffect, useRef } from 'react';
import './FeedbackDisplay.css';

export default function FeedbackDisplay({ evaluation, onRetry, onNewScenario, onChangeTopic }) {
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef(null);

  const { verdict, matchedConcepts = [], feedback, hint } = evaluation;

  // Canvas confetti animation for correct answers
  useEffect(() => {
    if (verdict !== 'correct' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 400;

    const colors = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
    const particles = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        speed: Math.random() * 3 + 2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speed;
        p.x += Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;

        if (p.y < canvas.height) {
          activeParticles++;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 400;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [verdict]);

  const getVerdictLabel = () => {
    switch (verdict) {
      case 'correct':
        return 'Senior Engineer Approved ✅';
      case 'partial':
        return 'Partial Diagnosis ⚠️';
      case 'incorrect':
        return 'Incorrect Diagnosis ❌';
      default:
        return 'Diagnosis Evaluated';
    }
  };

  const getVerdictClass = () => {
    switch (verdict) {
      case 'correct':
        return 'verdict-correct';
      case 'partial':
        return 'verdict-partial';
      case 'incorrect':
        return 'verdict-incorrect';
      default:
        return '';
    }
  };

  return (
    <div className={`feedback-wrapper animate-fade-in ${getVerdictClass()}`}>
      {verdict === 'correct' && (
        <canvas ref={canvasRef} className="confetti-canvas" />
      )}

      <div className="feedback-card glass-card">
        <div className="verdict-banner">
          <div className="verdict-status">{getVerdictLabel()}</div>
        </div>

        <div className="feedback-author">
          <div className="author-avatar">👴🏽</div>
          <div className="author-meta">
            <div className="author-name">Alex (Senior Staff Engineer)</div>
            <div className="author-title">Code Reviewer & Incident Commander</div>
          </div>
        </div>

        <div className="feedback-quote">
          <p className="feedback-quote-text">"{feedback}"</p>
        </div>

        {matchedConcepts.length > 0 && (
          <div className="matched-concepts-section">
            <h4 className="section-label">Identified Concepts & Rubric Points:</h4>
            <div className="concepts-list">
              {matchedConcepts.map((concept, index) => (
                <span key={index} className="concept-chip">
                  🔍 {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {hint && verdict !== 'correct' && (
          <div className={`hint-card ${showHint ? 'expanded' : ''}`}>
            <button
              className="hint-toggle-btn"
              onClick={() => setShowHint(!showHint)}
            >
              <span>💡 {showHint ? 'Hide Reviewer\'s Hint' : 'Request a Hint'}</span>
              <span className="arrow">{showHint ? '▲' : '▼'}</span>
            </button>
            {showHint && (
              <div className="hint-content animate-fade-in">
                <p>{hint}</p>
              </div>
            )}
          </div>
        )}

        <div className="feedback-actions">
          {verdict !== 'correct' && (
            <button className="btn btn-secondary retry-btn" onClick={onRetry}>
              Try Again 🔄
            </button>
          )}
          <button className="btn btn-secondary change-topic-btn" onClick={onChangeTopic}>
            Change Topic
          </button>
          <button className="btn btn-primary next-btn" onClick={onNewScenario}>
            Next Crisis →
          </button>
        </div>
      </div>
    </div>
  );
}
