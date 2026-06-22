/**
 * Mental Calculations — Tela de Vitória
 */
import React, { useEffect } from 'react';
import useAudio from '../../../hooks/useAudio';
import './Result.css';

export default function Victory({ stars, score, credits, correct, total, onContinue, onRetry }) {
  const { playVictory } = useAudio();
  useEffect(() => { playVictory(); }, []); // eslint-disable-line

  const pct = Math.round((correct / total) * 100);

  return (
    <div className="result-page chalkboard chalkboard-frame animate-fadeIn">
      {/* Confetti */}
      <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            backgroundColor: ['#4CAF50', '#42A5F5', '#FFD54F', '#EF5350', '#AB47BC'][i % 5],
          }} />
        ))}
      </div>

      <div className="result-content animate-bounceIn">
        <h1 className="result-emoji">🎉</h1>
        <h2 className="chalk-text-strong result-title">Parabéns!</h2>
        <p className="result-subtitle">Fase concluída com sucesso!</p>

        <div className="result-stars">
          {[1, 2, 3].map(s => (
            <span key={s} className={`star ${s <= stars ? 'earned' : 'empty'}`}>
              {s <= stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-value">{correct}/{total}</span>
            <span className="result-stat-label">Acertos ({pct}%)</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">{score}</span>
            <span className="result-stat-label">Pontuação</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">+{credits}</span>
            <span className="result-stat-label">Créditos</span>
          </div>
        </div>

        <div className="result-buttons">
          <button className="chalk-btn chalk-btn-green" onClick={onContinue}>→ Continuar</button>
          <button className="chalk-btn chalk-btn-blue" onClick={onRetry}>🔄 Repetir</button>
        </div>
      </div>
    </div>
  );
}
