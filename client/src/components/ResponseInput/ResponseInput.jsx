import React, { useState } from 'react';
import { getHint } from '../../services/api';
import { mockGetHint } from '../../mocks/demoData';
import './ResponseInput.css';

export default function ResponseInput({ onSubmit, isLoading, scenario, isDemoMode }) {
  const [response, setResponse] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [hints, setHints] = useState([]);
  const [visibleHintsCount, setVisibleHintsCount] = useState(0);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const minLength = 20;
  const currentLength = response.trim().length;
  const isTooShort = currentLength < minLength;

  const handleGetHint = async () => {
    if (isLoadingHint || visibleHintsCount >= 3) return;
    
    if (hints.length === 0) {
      setIsLoadingHint(true);
      try {
        const data = isDemoMode ? await mockGetHint(scenario) : await getHint(scenario);
        if (data && data.hints && data.hints.length > 0) {
          setHints(data.hints);
          setVisibleHintsCount(1);
        } else {
          setHints(['Failed to load hint. Give it your best guess!']);
          setVisibleHintsCount(1);
        }
      } catch (err) {
        console.error(err);
        setHints(['Failed to load hint. Give it your best guess!']);
        setVisibleHintsCount(1);
      } finally {
        setIsLoadingHint(false);
      }
    } else {
      setVisibleHintsCount(prev => Math.min(prev + 1, 3));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTooShort && !isLoading) {
      onSubmit(response, visibleHintsCount);
    }
  };

  return (
    <div className="response-input-wrapper animate-fade-in">
      <form onSubmit={handleSubmit} className="response-card glass-card">
        <div className="response-header">
          <label htmlFor="user-diagnosis" className="form-label response-label">
            Your Diagnosis & Fix:
          </label>
          <div className="mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${!isCodeMode ? 'active' : ''}`}
              onClick={() => setIsCodeMode(false)}
            >
              Prose
            </button>
            <button
              type="button"
              className={`toggle-btn ${isCodeMode ? 'active' : ''}`}
              onClick={() => setIsCodeMode(true)}
            >
              Pseudo-code
            </button>
          </div>
        </div>

        <textarea
          id="user-diagnosis"
          className={`form-textarea response-textarea ${isCodeMode ? 'code-mode' : ''}`}
          rows={6}
          placeholder={
            isCodeMode
              ? `// Write pseudo-code or query changes here\nALTER TABLE users ADD INDEX ...`
              : "Explain the underlying cause of the issue and how you would go about resolving it..."
          }
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          disabled={isLoading}
        />

        {visibleHintsCount > 0 && (
          <div className="hint-box animate-fade-in" style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#bfdbfe',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {hints.slice(0, visibleHintsCount).map((h, i) => (
              <div key={i}>
                <strong>Hint {i + 1}:</strong> {h}
              </div>
            ))}
          </div>
        )}

        <div className="response-footer">
          <div className="char-counter">
            {isTooShort ? (
              <span className="char-warning">
                ⚠️ Min {minLength} chars ({currentLength}/{minLength})
              </span>
            ) : (
              <span className="char-success">
                ✓ Ready ({currentLength} chars)
              </span>
            )}
          </div>
          <div className="button-group" style={{ display: 'flex', gap: '12px' }}>
            {visibleHintsCount < 3 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGetHint}
                disabled={isLoadingHint || isLoading}
              >
                {isLoadingHint ? 'Getting hint...' : `Get Hint ${visibleHintsCount + 1}/3 (-2 pts)`}
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={isTooShort || isLoading}
            >
              {isLoading ? 'Sending to Senior Eng...' : 'Submit Diagnosis →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
