import React, { useState } from 'react';
import SubjectSelector from './components/SubjectSelector';
import ScenarioDisplay from './components/ScenarioDisplay';
import ResponseInput from './components/ResponseInput';
import FeedbackDisplay from './components/FeedbackDisplay';
import Scoreboard from './components/Scoreboard';
import LoadingState from './components/LoadingState';
import { generateScenario, evaluateResponse } from './api';

export default function App() {
  const [phase, setPhase] = useState('idle'); // idle | loading-scenario | scenario-ready | loading-evaluation | feedback-shown
  const [subject, setSubject] = useState('');
  const [scenario, setScenario] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  
  // Keep score & streak in memory (could also be synced with localStorage)
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('cs_crisis_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('cs_crisis_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateScoreAndStreak = (verdict) => {
    let newScore = score;
    let newStreak = streak;

    if (verdict === 'correct') {
      newScore += 10;
      newStreak += 1;
    } else if (verdict === 'partial') {
      newScore += 5;
      // Streak is maintained for partial, doesn't increment or reset
    } else if (verdict === 'incorrect') {
      newScore += 0;
      newStreak = 0; // Reset streak
    }

    setScore(newScore);
    setStreak(newStreak);
    localStorage.setItem('cs_crisis_score', newScore.toString());
    localStorage.setItem('cs_crisis_streak', newStreak.toString());
  };

  const handleSelectSubject = async (selectedSubject) => {
    setSubject(selectedSubject);
    setPhase('loading-scenario');
    setError(null);
    try {
      const data = await generateScenario(selectedSubject);
      setScenario(data);
      setPhase('scenario-ready');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate incident scenario. Please try again.');
      setPhase('idle');
    }
  };

  const handleSubmitResponse = async (userResponse) => {
    setPhase('loading-evaluation');
    setError(null);
    try {
      const data = await evaluateResponse(scenario, userResponse);
      setEvaluation(data);
      updateScoreAndStreak(data.verdict);
      setPhase('feedback-shown');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to evaluate your diagnosis. Please try again.');
      setPhase('scenario-ready');
    }
  };

  const handleRetry = () => {
    setError(null);
    setEvaluation(null);
    setPhase('scenario-ready');
  };

  const handleNewScenario = () => {
    setError(null);
    setScenario(null);
    setEvaluation(null);
    setPhase('idle');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="hero-title">CS Crisis Simulator</h1>
        <p className="hero-tagline">
          Step into the boots of an On-Call Engineer. Diagnose production systems breakdowns and get graded by a Senior Engineer.
        </p>
      </header>

      <Scoreboard score={score} streak={streak} />

      {error && (
        <div className="glass-card error-banner animate-fade-in mb-8" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <h4 style={{ color: '#fecaca', fontWeight: '700' }}>System Alert</h4>
              <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginTop: '2px' }}>{error}</p>
            </div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ marginTop: '16px', padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {phase === 'idle' && (
        <SubjectSelector onSelectSubject={handleSelectSubject} isLoading={false} />
      )}

      {phase === 'loading-scenario' && (
        <LoadingState 
          message="Spinning up the incident..." 
          submessage={`Generating a realistic production crisis for: ${subject}`} 
        />
      )}

      {phase === 'scenario-ready' && (
        <>
          <ScenarioDisplay scenario={scenario} onBack={handleNewScenario} />
          <ResponseInput onSubmit={handleSubmitResponse} isLoading={false} scenario={scenario} />
        </>
      )}

      {phase === 'loading-evaluation' && (
        <LoadingState 
          message="Senior Staff Engineer is reviewing your diagnosis..." 
          submessage="Evaluating analysis details and grading against the incident rubric" 
        />
      )}

      {phase === 'feedback-shown' && (
        <>
          <ScenarioDisplay scenario={scenario} onBack={handleNewScenario} />
          <FeedbackDisplay 
            evaluation={evaluation} 
            onRetry={handleRetry} 
            onNewScenario={handleNewScenario} 
          />
        </>
      )}
    </div>
  );
}
