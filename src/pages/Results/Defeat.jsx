/**
 * Mental Calculations — Tela de Derrota
 */
import React, { useEffect } from 'react';
import useAudio from '../../hooks/useAudio';
import './Result.css';

export default function Defeat({ correct, total, onRetry, onMenu }) {
  const { playDefeat } = useAudio();
  useEffect(() => { playDefeat(); }, []); // eslint-disable-line

  const pct = Math.round((correct / total) * 100);

  return (
    <div className="result-page chalkboard chalkboard-frame animate-fadeIn">
      <div className="result-content animate-bounceIn">
        <h1 className="result-emoji">😢</h1>
        <h2 className="chalk-text-strong result-title">Não foi dessa vez...</h2>
        <p className="result-subtitle">Você precisa acertar mais de 60% para avançar.</p>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-value">{correct}/{total}</span>
            <span className="result-stat-label">Acertos ({pct}%)</span>
          </div>
        </div>

        <p className="result-hint chalk-text-dim">💡 Dica: Revise a fórmula de Bhaskara e tente novamente!</p>

        <div className="result-buttons">
          <button className="chalk-btn chalk-btn-green" onClick={onRetry}>🔄 Tentar Novamente</button>
          <button className="chalk-btn chalk-btn-red" onClick={onMenu}>🏠 Menu</button>
        </div>
      </div>
    </div>
  );
}
