/**
 * Mental Calculations — Perfil do Jogador
 */
import { useState } from 'react';
import useGameState from '../../../controllers/GameController';
import './Profile.css';

function getAvatarSource(avatar) {
  if (typeof avatar !== 'string') return null;
  if (/^https?:\/\//i.test(avatar)) return avatar;
  if (/^\/\//.test(avatar)) return `https:${avatar}`;
  return null;
}

export default function Profile({ onNavigate }) {
  const { gameState, profile, updateProfile } = useGameState();
  const avatarSource = getAvatarSource(profile.avatar);
  const [failedAvatarSource, setFailedAvatarSource] = useState(null);
  const avatarLoadFailed = failedAvatarSource === avatarSource;

  const avgTime = gameState.questionsAnswered > 0
    ? ((gameState.totalTime / gameState.questionsAnswered) / 1000).toFixed(1)
    : '0.0';

  const totalLevels = 20;
  const completedCount = gameState.completedLevels.flat().filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalLevels) * 100);

  return (
    <div className="profile-page chalkboard chalkboard-frame animate-fadeIn">
      <h2 className="chalk-text-strong profile-title">👤 Perfil</h2>

      <div className="profile-card animate-fadeInUp">
        <div className="profile-avatar">
          {avatarSource && !avatarLoadFailed ? (
            <img
              className="profile-avatar-image"
              src={avatarSource}
              alt="Avatar do perfil"
              draggable="false"
              referrerPolicy="no-referrer"
              onError={() => setFailedAvatarSource(avatarSource)}
            />
          ) : avatarSource ? <span className="profile-avatar-fallback" aria-label="Avatar indisponível">👤</span> : profile.avatar}
        </div>
        <input
          className="chalk-input profile-name-input"
          value={profile.name}
          onChange={(e) => updateProfile('name', e.target.value)}
          placeholder="Seu nome"
        />
      </div>

      <div className="profile-stats">
        <div className="stat-card animate-fadeInUp stagger-1">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">{gameState.totalScore}</span>
          <span className="stat-label">Pontuação</span>
        </div>
        <div className="stat-card animate-fadeInUp stagger-2">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{gameState.totalCorrect}</span>
          <span className="stat-label">Acertos</span>
        </div>
        <div className="stat-card animate-fadeInUp stagger-3">
          <span className="stat-icon">❌</span>
          <span className="stat-value">{gameState.totalWrong}</span>
          <span className="stat-label">Erros</span>
        </div>
        <div className="stat-card animate-fadeInUp stagger-4">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{avgTime}s</span>
          <span className="stat-label">Tempo Médio</span>
        </div>
        <div className="stat-card animate-fadeInUp stagger-5">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{gameState.credits}</span>
          <span className="stat-label">Créditos</span>
        </div>
        <div className="stat-card animate-fadeInUp stagger-5">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{progressPct}%</span>
          <span className="stat-label">Progresso</span>
        </div>
      </div>

      <div className="profile-progress-bar">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        <span className="progress-label">{completedCount}/{totalLevels} fases completas</span>
      </div>

      {/* Caderno de Erros e Diagnósticos (Spaced Review) */}
      <div className="error-notebook-section animate-fadeInUp">
        <h3 className="chalk-text-strong section-title">📓 Caderno de Revisão & Erros Conceituais</h3>
        {(!gameState.errorNotebook || gameState.errorNotebook.length === 0) ? (
          <p className="chalk-text-dim empty-notebook-text">
            Nenhum erro registrado recentemente. Seu histórico de cálculo mental está impecável! 🎯
          </p>
        ) : (
          <div className="error-notebook-list">
            {gameState.errorNotebook.slice(0, 5).map((item) => (
              <div key={item.id} className="error-notebook-card">
                <div className="notebook-card-header">
                  <span className="notebook-topic-tag">📚 {item.topic}</span>
                  <span className="notebook-date">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="notebook-question">{item.questionText}</p>
                <div className="notebook-answers">
                  <span className="wrong-answer">❌ Resposta marcada: {item.wrongAnswer || 'Tempo esgotado'}</span>
                  <span className="correct-answer">✅ Gabarito: {item.correctAnswer}</span>
                </div>
                {item.diagnostic && (
                  <p className="notebook-diag">💡 <em>{item.diagnostic}</em></p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
