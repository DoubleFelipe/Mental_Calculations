/**
 * Mental Calculations — Tela de Quiz (View)
 * Mostra questões uma por vez com timer e feedback, consumindo o controlador.
 */
import { useState } from 'react';
import useQuizController from '../../../controllers/useQuizController';
import Whiteboard from '../../components/Whiteboard/Whiteboard.jsx';
import './Quiz.css';

export default function Quiz({ worldIndex, levelIndex, onComplete, onExit }) {
  const {
    level,
    difficulty,
    selectedDifficultyLabel,
    questionsCount,
    timeLimit,
    questions,
    currentQ,
    selected,
    showFeedback,
    isCorrect,
    score,
    showIntro,
    startQuiz,
    timeLeft,
    percentage,
    handleAnswer,
    handleNext,
    activatePowerUp,
    hiddenAlternatives,
    powerUpMessage,
    powerUpUses,
    shieldActive,
  } = useQuizController({ worldIndex, levelIndex, onComplete });

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const btnColors = ['chalk-btn-green', 'chalk-btn-blue', 'chalk-btn-red', 'chalk-btn-yellow'];
  const handleExit = () => {
    if (!showIntro && !window.confirm('Sair desta fase? O resultado desta tentativa não será salvo.')) return;
    onExit?.();
  };

  // Tela de introdução/explicação
  if (showIntro) {
    return (
      <div className="quiz-page chalkboard chalkboard-frame animate-fadeIn">
        <div className="quiz-intro">
          <h2 className="chalk-text-strong">📐 {level?.name}</h2>
          <p className="chalk-text">Uma nova missão apareceu! Vença os desafios e ganhe XP enquanto domina as equações do 2º grau.</p>
          <div className="mission-reward">🏆 Recompensa da missão: até {questionsCount * 20} XP + uma habilidade matemática</div>
          <p className="chalk-text">Seu kit de ferramentas para esta fase:</p>
          <div className="formula-display">
            <span className="formula-text">x = (-b ± √(b² - 4ac)) / 2a</span>
          </div>
          <p className="chalk-text">Onde Δ = b² - 4ac é o discriminante.</p>
          <div className="intro-info">
            <span>📝 {questionsCount} questões</span>
            <span>⏱️ {timeLimit}s por questão ({selectedDifficultyLabel})</span>
            <span>📊 Nível da fase: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
          </div>
          <button className="chalk-btn chalk-btn-green" onClick={startQuiz}>
            Começar! →
          </button>
          <button className="chalk-btn chalk-btn-red quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">
            ← Sair da fase
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="quiz-page chalkboard chalkboard-frame">
      {/* Header */}
      <div className="quiz-header">
        <span className="quiz-counter">🗺️ Desafio {currentQ + 1} / {questions.length}</span>
        <div className={`quiz-timer ${percentage < 30 ? 'danger' : percentage < 60 ? 'warning' : ''}`}>
          ⏱️ {timeLeft}s
          <div className="timer-bar">
            <div className="timer-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <span className="quiz-diff">{question.difficulty} · ✨ {score.correct * 20} XP</span>
      </div>


      {/* Progresso */}
      <div className="quiz-progress-dots">
        {questions.map((_, i) => (
          <span key={i} className={`q-dot ${i === currentQ ? 'current' : i < currentQ ? (score.times[i] && i < score.correct + score.wrong ? 'done' : '') : ''}`} />
        ))}
      </div>

      {/* Questão */}
      <div className="quiz-question animate-fadeInUp">
        <div className="mission-label">MISSÃO {currentQ + 1} · HABILIDADE: {question.skill}</div>
        <p className="question-text chalk-text-strong">{question.text}</p>
        <p className="quick-hint">🎯 Pense na primeira jogada. Escolha sua resposta e depois abra o mapa da solução.</p>
        <div className="quiz-wb-toggle" style={{ marginTop: 12 }}>
          <button className={`chalk-btn`} onClick={() => setShowWhiteboard(s => !s)}>
            {showWhiteboard ? 'Fechar Quadro' : 'Abrir Quadro Branco'}
          </button>
        </div>
      </div>

      {showWhiteboard && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Whiteboard />
        </div>
      )}

      <div className="quiz-powerups" aria-label="Consumíveis">
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_hint')} disabled={showFeedback || !powerUpUses.item_hint}>💡 Dica ({powerUpUses.item_hint || 0})</button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_time')} disabled={showFeedback || !powerUpUses.item_time}>⏰ +15s ({powerUpUses.item_time || 0})</button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_shield')} disabled={showFeedback || shieldActive || !powerUpUses.item_shield}>🛡️ Escudo ({powerUpUses.item_shield || 0})</button>
        <button className="chalk-btn quiz-powerup" onClick={() => activatePowerUp('item_double')} disabled={showFeedback || !powerUpUses.item_double}>✨ Dobrar ({powerUpUses.item_double || 0})</button>
      </div>
      {powerUpMessage && <div className="powerup-message">{powerUpMessage}</div>}

      {/* Alternativas */}
      <div className="quiz-alternatives">
        {question.alternatives.map((alt, i) => {
          let extraClass = '';
          if (showFeedback) {
            if (i === question.correctIndex) extraClass = 'correct';
            else if (i === selected && !isCorrect) extraClass = 'wrong';
          }
          const hidden = hiddenAlternatives.includes(i);
          return (
            <button
              key={i}
              className={`chalk-btn ${btnColors[i]} quiz-alt ${hidden ? 'powerup-hidden' : ''} ${extraClass} ${showFeedback && i === question.correctIndex ? 'animate-pulse' : ''} ${showFeedback && i === selected && !isCorrect ? 'animate-shake' : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback || hidden}
            >
              {alt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`quiz-feedback animate-fadeInUp ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          {isCorrect ? (
            <div className="feedback-content">
              <span className="feedback-icon">✅</span>
              <span className="feedback-text">Chefão vencido! +20 XP</span>
            </div>
          ) : (
            <div className="feedback-content">
              <span className="feedback-icon">❌</span>
              <span className="feedback-text">
                {powerUpMessage || (timeLeft === 0 ? 'O tempo acabou! Vamos transformar esse tropeço em experiência.' : 'Quase! Cada tentativa revela uma pista nova.')}
              </span>
            </div>
          )}
          <div className="explanation-box animate-fadeInDown">
            <div className="solution-heading">🧭 Mapa da solução <span>{Math.min(visibleSteps, question.steps.length)}/{question.steps.length}</span></div>
            <p className="solution-prompt">💡 Pergunta-chave: {visibleSteps === 0 ? 'qual regra ou fórmula destrava este desafio?' : 'por que este passo funciona?'}</p>
            <ol className="solution-steps">
              {question.steps.slice(0, visibleSteps).map((step, index) => (
                <li key={index}><span className="step-number">{index + 1}</span><span>{step}</span></li>
              ))}
            </ol>
            {visibleSteps < question.steps.length ? (
              <button className="chalk-btn chalk-btn-yellow reveal-step-btn" onClick={() => setVisibleSteps(value => Math.min(value + 1, question.steps.length))}>
                {visibleSteps === 0 ? '🔎 Revelar a primeira pista' : '➡️ Revelar próximo passo'}
              </button>
            ) : (
              <div className="takeaway"><strong>🔓 Habilidade desbloqueada: {question.skill}</strong><br />{question.takeaway}<br /><span>Você ganhou prática em: {question.payoff}.</span></div>
            )}
            {visibleSteps === question.steps.length && (
              <button className="chalk-btn chalk-btn-green next-btn" onClick={() => { setVisibleSteps(0); handleNext(); }}>
                {currentQ + 1 >= questions.length ? '🏁 Concluir missão' : '🚀 Próximo desafio'}
              </button>
            )}
          </div>
        </div>
      )}
      <button className="chalk-btn chalk-btn-red quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">
        ← Sair da fase
      </button>
    </div>
  );
}
