import React, { useState } from 'react';
import './SubjectSelector.css';

const CURATED_SUBJECTS = [
  { id: 'db-normalization', name: 'Database Normalization', icon: '🗄️', desc: '1NF, 2NF, 3NF, BCNF anomalies & key violations' },
  { id: 'os-paging', name: 'OS Paging & Virtual Memory', icon: '🧠', desc: 'Page faults, thrashing, translation, swap space' },
  { id: 'tcp-vs-udp', name: 'TCP vs UDP', icon: '🌐', desc: 'Connection overhead, reliability, handshakes, flow control' },
  { id: 'db-indexing', name: 'Database Indexing', icon: '🔍', desc: 'B-Trees, full table scans, sequential vs index scans, composite indexes' },
  { id: 'hash-collisions', name: 'Hash Collisions', icon: '🧩', desc: 'Hash maps, hash functions, chaining, open addressing, O(N) degradation' },
  { id: 'caching', name: 'Caching Strategies', icon: '⚡', desc: 'LRU, cache stampede, write-through vs write-back, stale cache data' },
  { id: 'recursion', name: 'Recursion & Stack Overflow', icon: '🔄', desc: 'Recursion depth, base case omissions, call stack limits' },
  { id: 'deadlocks', name: 'Deadlocks', icon: '🔒', desc: 'Circular wait, locking order, mutual exclusion, resource allocation' },
  { id: 'dns', name: 'DNS Resolution', icon: '🧭', desc: 'TTL values, delegation path, recursive lookups, cached entries' },
  { id: 'load-balancing', name: 'Load Balancing', icon: '⚖️', desc: 'Round robin, sticky sessions, failover, node overload, health checks' }
];

export default function SubjectSelector({ onSelectSubject, isLoading }) {
  const [selectedId, setSelectedId] = useState(null);
  const [customSubject, setCustomSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  const handleSelectCurated = (subject) => {
    setSelectedId(subject.id);
    setCustomSubject(''); // Clear custom when curated is chosen
  };

  const handleCustomChange = (e) => {
    setCustomSubject(e.target.value);
    setSelectedId(null); // Deselect curated when custom is typed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedId) {
      const subject = CURATED_SUBJECTS.find(s => s.id === selectedId);
      if (subject) onSelectSubject(subject.name, difficulty);
    } else if (customSubject.trim() !== '') {
      onSelectSubject(customSubject.trim(), difficulty);
    }
  };

  const activeSubject = selectedId 
    ? CURATED_SUBJECTS.find(s => s.id === selectedId)?.name 
    : customSubject.trim();

  return (
    <div className="subject-selector-wrapper animate-fade-in">
      <h2 className="section-title">Select a Computer Science Domain</h2>
      <p className="section-subtitle">Pick an area to generate a production-style software engineering crisis</p>

      <div className="subjects-grid">
        {CURATED_SUBJECTS.map((subject) => (
          <div
            key={subject.id}
            className={`subject-card glass-card ${selectedId === subject.id ? 'active' : ''}`}
            onClick={() => handleSelectCurated(subject)}
          >
            <div className="subject-icon">{subject.icon}</div>
            <div className="subject-info">
              <h3 className="subject-name">{subject.name}</h3>
              <p className="subject-desc">{subject.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="custom-subject-form glass-card">
        <div className="custom-input-header">
          <label htmlFor="custom-subject" className="form-label">Or, enter any custom CS topic:</label>
          <span className="experimental-badge">Experimental</span>
        </div>
        <input
          id="custom-subject"
          type="text"
          className="custom-input"
          placeholder="e.g. Garbage Collection, RAFT Consensus, CORS Policy..."
          value={customSubject}
          onChange={handleCustomChange}
          disabled={isLoading}
        />
      </form>

      <div className="difficulty-selector glass-card" style={{ marginTop: '24px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 className="form-label" style={{ margin: 0 }}>Select Difficulty</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Easy', 'Medium', 'Hard'].map(level => (
            <button
              key={level}
              type="button"
              className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="action-row">
        <button
          className="btn btn-primary start-button"
          onClick={handleSubmit}
          disabled={isLoading || !activeSubject}
        >
          {isLoading ? 'Spinning up crisis...' : 'Initialize Incident 🚨'}
        </button>
      </div>
    </div>
  );
}
