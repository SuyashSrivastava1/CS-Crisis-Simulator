import React from 'react';
import './LoadingState.css';

export default function LoadingState({ message, submessage }) {
  return (
    <div className="loading-state-container animate-fade-in">
      <div className="loading-card glass-card">
        <div className="pulse-loader">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        <h3 className="loading-message">{message || 'Loading...'}</h3>
        {submessage && <p className="loading-submessage">{submessage}</p>}
      </div>
    </div>
  );
}
