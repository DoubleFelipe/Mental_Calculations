/**
 * Mental Calculations — Tela de Vitória
 */
import { useEffect } from 'react';
import useAudio from '../../../hooks/useAudio';
import './Result.css';

const CONFETTI_COLORS = ['#4CAF50', '#42A5F5', '#FFD54F', '#EF5350', '#AB47BC'];
const CONFETTI_PIECES = Array.from({ length: 30 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  animationDelay: `${((index * 17) % 20) / 10}s`,
  animationDuration: `${2 + ((index * 13) % 30) / 10}s`,
  backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

export default function Victory({ stars, score, credits, correct, total, onContinue, onRetry }) {
  const { playVictory } = useAudio();
  useEffect(() => { playVictory(); }, []); // eslint-disable-line

  const pct = Math.round((correct / total) * 100);

  return (
    <div className="result-page chalkboard chalkboard-frame animate-fadeIn">
      {/* Confetti */}
      <div className="confetti-container">
        {CONFETTI_PIECES.map((style, index) => (
          <div key={index} className="confetti-piece" style={style} />
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
