import React, { useState } from 'react';
import './ResponseInput.css';

export default function ResponseInput({ onSubmit, isLoading }) {
  const [response, setResponse] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);

  const minLength = 20;
  const currentLength = response.trim().length;
  const isTooShort = currentLength < minLength;

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
          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={isTooShort || isLoading}
          >
            {isLoading ? 'Sending to Senior Eng...' : 'Submit Diagnosis →'}
          </button>
        </div>
      </form>
    </div>
  );
}
