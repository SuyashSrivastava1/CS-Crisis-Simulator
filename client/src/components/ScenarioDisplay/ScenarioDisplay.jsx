import React from 'react';
import './ScenarioDisplay.css';

export default function ScenarioDisplay({ scenario, onBack }) {
  if (!scenario) return null;

  return (
    <div className="scenario-display-wrapper animate-fade-in">
      <div className="scenario-meta">
        <button className="back-link" onClick={onBack}>
          ← Change Subject
        </button>
        <span className="incident-badge">
          🚨 Active Incident
        </span>
      </div>

      <div className="scenario-card glass-card">
        <div className="incident-header">
          <div className="avatar-placeholder">🤖</div>
          <div className="incident-title-area">
            <h2 className="scenario-title">{scenario.title}</h2>
            <div className="incident-timestamp">
              Reported just now • Severity: High
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="scenario-narrative">
          <p className="narrative-heading">Incident Narrative:</p>
          <div className="narrative-body">{scenario.narrative}</div>
        </div>

        {scenario.context && (
          <div className="scenario-context">
            <p className="context-heading">Supporting Details (Logs / Metrics / Code):</p>
            <pre className="code-block">
              <code>{scenario.context}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
