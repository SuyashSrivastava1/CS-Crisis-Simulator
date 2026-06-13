import React, { useState } from 'react';
import { getHint } from '../api';
import './ResponseInput.css';

export default function ResponseInput({ onSubmit, isLoading, scenario }) {
  const [response, setResponse] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [hint, setHint] = useState(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const minLength = 20;
  const currentLength = response.trim().length;
  const isTooShort = currentLength < minLength;

  const handleGetHint = async () => {
    if (isLoadingHint) return;
    setIsLoadingHint(true);
    try {
      const data = await getHint(scenario);
      setHint(data.hint);
    } catch (err) {
      console.error(err);
      setHint('Failed to load hint. Give it your best guess!');
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTooShort && !isLoading) {
      onSubmit(response);
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

        {hint && (
          <div className="hint-box animate-fade-in" style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#bfdbfe'
          }}>
            <strong>Gist:</strong> {hint}
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
            {!hint && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGetHint}
                disabled={isLoadingHint || isLoading}
              >
                {isLoadingHint ? 'Getting gist...' : 'Get a Gist'}
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
