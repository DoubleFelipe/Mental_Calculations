/** Tela de quiz: introdução, questão, quadro de resolução e feedback. */
import { useEffect, useState } from 'react';
import useQuizController from '../../../controllers/useQuizController';
import Whiteboard from '../../components/Whiteboard/Whiteboard.jsx';
import './Quiz.css';

export default function Quiz({ worldIndex, levelIndex, onComplete, onExit }) {
  const {
    level, difficulty, selectedDifficultyLabel, questionsCount, timeLimit, questions,
    currentQ, selected, showFeedback, isCorrect, score, showIntro, startQuiz,
    timeLeft, percentage, handleAnswer, handleNext, activatePowerUp,
    hiddenAlternatives, powerUpMessage, powerUpUses, shieldActive, pauseTimer, startTimer,
  } = useQuizController({ worldIndex, levelIndex, onComplete });
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const answerColors = ['chalk-btn-green', 'chalk-btn-blue', 'chalk-btn-red', 'chalk-btn-yellow'];
  const handleExit = () => {
    if (!showIntro && !window.confirm('Sair desta fase? O resultado desta tentativa não será salvo.')) return;
    onExit?.();
  };

  useEffect(() => {
    if (showIntro) return;
    if (showFeedback) {
      pauseTimer();
      return;
    }
    if (showWhiteboard) pauseTimer();
    else startTimer();
  }, [showWhiteboard, showIntro, showFeedback, pauseTimer, startTimer]);

  if (showIntro) {
    const difficultyLabel = difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil';
    return (
      <div className="quiz-page chalkboard chalkboard-frame animate-fadeIn">
        <button className="quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">← Sair da fase</button>
        <section className="quiz-intro" aria-labelledby="quiz-intro-title">
          <h2 id="quiz-intro-title" className="chalk-text-strong">📐 {level?.name}</h2>
          <p>Você vai identificar os coeficientes, calcular o discriminante e aplicar a fórmula de Bhaskara.</p>
          <div className="formula-display" aria-label="x igual a menos b mais ou menos raiz quadrada de delta, sobre 2a">
            <span className="formula-text">x = <span className="fraction"><span>−b ± √Δ</span><span>2a</span></span></span>
            <span className="formula-caption">Δ = b² − 4ac</span>
          </div>
          <div className="coefficient-legend" aria-label="Coeficientes da equação de segundo grau">
            <span><strong>a</strong> coeficiente de x²</span><span><strong>b</strong> coeficiente de x</span><span><strong>c</strong> termo constante</span>
          </div>
          <div className="intro-info">
            <span>📝 {questionsCount} questões</span>
            <span>⏱️ {timeLimit}s por questão · {selectedDifficultyLabel}</span>
            <span>📊 Nível {difficultyLabel}</span>
            <span>🏆 Até {questionsCount * 20} XP e prática em {level?.name || 'Bhaskara'}</span>
          </div>
          <div className="intro-actions">
            <button className="chalk-btn chalk-btn-green" onClick={startQuiz}>Começar! →</button>
          </div>
        </section>
      </div>
    );
  }

  const question = questions[currentQ];
  const displayedSteps = showFeedback ? Math.max(visibleSteps, 1) : visibleSteps;
  const availablePowerUps = [
    ['item_hint', '💡 Dica', powerUpUses.item_hint],
    ['item_time', '⏰ +15s', powerUpUses.item_time],
    ['item_shield', '🛡️ Escudo', powerUpUses.item_shield],
    ['item_double', '✨ Dobrar', powerUpUses.item_double],
  ].filter(([id, , uses]) => uses > 0 && !(id === 'item_shield' && shieldActive));

  return (
    <div className="quiz-page chalkboard chalkboard-frame">
      <div className="quiz-header">
        <span className="quiz-counter">🗺️ Questão {currentQ + 1} de {questions.length}</span>
        <div className={`quiz-timer ${percentage < 30 ? 'danger' : percentage < 60 ? 'warning' : ''}`} aria-label={`${timeLeft} segundos restantes`}>
          <span aria-live="polite">⏱️ {timeLeft}s</span>
          <div className="timer-bar" role="progressbar" aria-label="Tempo restante" aria-valuemin="0" aria-valuemax={timeLimit} aria-valuenow={timeLeft}>
            <div className="timer-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <span className="quiz-diff">✨ {score.correct * 20} XP</span>
      </div>
      <div className="quiz-progress" aria-label={`Progresso: questão ${currentQ + 1} de ${questions.length}`}>
        <span>{currentQ + 1}/{questions.length}</span>
        <div className="quiz-progress-track"><div style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} /></div>
      </div>

      <section className="quiz-question animate-fadeInUp" aria-labelledby="question-title">
        <div className="mission-label">MISSÃO {currentQ + 1} · HABILIDADE: {question.skill}</div>
        <p id="question-title" className="question-text chalk-text-strong">{question.text}</p>
        <p className="quick-hint">Escolha uma resposta ou use o quadro para calcular.</p>
        <button className="chalk-btn quiz-wb-button" onClick={() => setShowWhiteboard((open) => !open)} aria-expanded={showWhiteboard}>
          <span aria-hidden="true">✎</span> {showWhiteboard ? 'Fechar quadro de resolução' : 'Abrir quadro de resolução'}
        </button>
      </section>

      {showWhiteboard && <Whiteboard question={question} />}

      {availablePowerUps.length > 0 && <div className="quiz-powerups" aria-label="Consumíveis disponíveis">
        {availablePowerUps.map(([id, label, uses]) => <button key={id} className="chalk-btn quiz-powerup" onClick={() => activatePowerUp(id)} disabled={showFeedback} title={`${uses} usos disponíveis`}>
          {label} ({uses})
        </button>)}
      </div>}
      {powerUpMessage && <div className="powerup-message" role="status">{powerUpMessage}</div>}

      <div className="quiz-alternatives" role="group" aria-label="Alternativas de resposta">
        {question.alternatives.map((alt, i) => {
          const hidden = hiddenAlternatives.includes(i);
          let stateClass = '';
          let stateLabel = '';
          if (showFeedback && i === question.correctIndex) { stateClass = 'correct'; stateLabel = 'Resposta correta'; }
          else if (showFeedback && i === selected && i !== question.correctIndex) { stateClass = 'wrong'; stateLabel = 'Sua resposta, incorreta'; }
          return <button key={`${alt}-${i}`} hidden={hidden} className={`chalk-btn ${answerColors[i]} quiz-alt ${stateClass}`} onClick={() => { handleAnswer(i); setVisibleSteps(1); }} disabled={showFeedback || hidden} aria-pressed={selected === i}>
            <span className="answer-state" aria-hidden="true">{stateClass === 'correct' ? '✓' : stateClass === 'wrong' ? '✗' : String.fromCharCode(65 + i)}</span>
            <span>{alt}</span>{stateLabel && <span className="answer-state-label">{stateLabel}</span>}
          </button>;
        })}
      </div>

      {showFeedback && <section className={`quiz-feedback animate-fadeInUp ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`} aria-live="polite" aria-labelledby="feedback-title">
        <div className="feedback-content">
          <span className="feedback-icon" aria-hidden="true">{isCorrect ? '✓' : '✗'}</span>
          <div><h2 id="feedback-title" className="feedback-text">{isCorrect ? 'Resposta correta!' : timeLeft === 0 ? 'O tempo acabou.' : 'Resposta incorreta.'}</h2>
            <p className="xp-earned">{isCorrect ? '+20 XP' : '+0 XP'} nesta questão</p></div>
        </div>
        <div className="explanation-box">
          <div className="solution-heading">🧭 Quadro de resolução <span>{Math.min(displayedSteps, question.steps.length)}/{question.steps.length}</span></div>
          <ol className="solution-steps">
            {question.steps.slice(0, displayedSteps).map((step, index) => <li key={index}><span className="step-number">{index + 1}</span><span>{step}</span></li>)}
          </ol>
          {displayedSteps < question.steps.length ? <button className="chalk-btn chalk-btn-yellow reveal-step-btn" onClick={() => setVisibleSteps((value) => Math.min(Math.max(value, 1) + 1, question.steps.length))}>
            Revelar próximo passo
          </button> : <div className="takeaway"><strong>Habilidade: {question.skill}</strong><br />{question.takeaway}<br /><span>Você praticou: {question.payoff}.</span></div>}
          {displayedSteps === question.steps.length && <button className="chalk-btn chalk-btn-green next-btn" onClick={() => { setVisibleSteps(0); setShowWhiteboard(false); handleNext(); }}>
            {currentQ + 1 >= questions.length ? '🏁 Concluir missão' : '🚀 Próxima questão'}
          </button>}
        </div>
      </section>}
      <button className="quiz-exit-btn" onClick={handleExit} aria-label="Sair da fase e voltar ao mapa">← Sair da fase</button>
    </div>
  );
}
