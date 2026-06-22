/**
 * Mental Calculations — Tela de Quiz (View)
 * Mostra questões uma por vez com timer e feedback, consumindo o controlador.
 */
import React, { useState } from 'react';
import useQuizController from '../../../controllers/useQuizController';
import Whiteboard from '../../components/Whiteboard/Whiteboard.jsx';
import './Quiz.css';

export default function Quiz({ worldIndex, levelIndex, onComplete }) {
  const {
    level,
    difficulty,
    questionsCount,
    timeLimit,
    questions,
    currentQ,
    selected,
    showFeedback,
    isCorrect,
    score,
    showExplanation,
    setShowExplanation,
    showIntro,
    startQuiz,
    timeLeft,
    percentage,
    handleAnswer,
    handleNext,
  } = useQuizController({ worldIndex, levelIndex, onComplete });

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const btnColors = ['chalk-btn-green', 'chalk-btn-blue', 'chalk-btn-red', 'chalk-btn-yellow'];

  // Tela de introdução/explicação
  if (showIntro) {
    return (
      <div className="quiz-page chalkboard chalkboard-frame animate-fadeIn">
        <div className="quiz-intro">
          <h2 className="chalk-text-strong">📐 {level?.name}</h2>
          <p className="chalk-text">Para resolver equações do 2º grau, use a fórmula de Bhaskara:</p>
          <div className="formula-display">
            <span className="formula-text">x = (-b ± √(b² - 4ac)) / 2a</span>
          </div>
          <p className="chalk-text">Onde Δ = b² - 4ac é o discriminante.</p>
          <div className="intro-info">
            <span>📝 {questionsCount} questões</span>
            <span>⏱️ {timeLimit}s por questão</span>
            <span>📊 Dificuldade: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
          </div>
          <button className="chalk-btn chalk-btn-green" onClick={startQuiz}>
            Começar! →
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
        <span className="quiz-counter">{currentQ + 1} / {questions.length}</span>
        <div className={`quiz-timer ${percentage < 30 ? 'danger' : percentage < 60 ? 'warning' : ''}`}>
          ⏱️ {timeLeft}s
          <div className="timer-bar">
            <div className="timer-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <span className="quiz-diff">{question.difficulty}</span>
      </div>

      {/* Progresso */}
      <div className="quiz-progress-dots">
        {questions.map((_, i) => (
          <span key={i} className={`q-dot ${i === currentQ ? 'current' : i < currentQ ? (score.times[i] && i < score.correct + score.wrong ? 'done' : '') : ''}`} />
        ))}
      </div>

      {/* Questão */}
      <div className="quiz-question animate-fadeInUp">
        <p className="question-text chalk-text-strong">{question.text}</p>
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

      {/* Alternativas */}
      <div className="quiz-alternatives">
        {question.alternatives.map((alt, i) => {
          let extraClass = '';
          if (showFeedback) {
            if (i === question.correctIndex) extraClass = 'correct';
            else if (i === selected && !isCorrect) extraClass = 'wrong';
          }
          return (
            <button
              key={i}
              className={`chalk-btn ${btnColors[i]} quiz-alt ${extraClass} ${showFeedback && i === question.correctIndex ? 'animate-pulse' : ''} ${showFeedback && i === selected && !isCorrect ? 'animate-shake' : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback}
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
              <span className="feedback-text">Correto! Muito bem!</span>
            </div>
          ) : (
            <div className="feedback-content">
              <span className="feedback-icon">❌</span>
              <span className="feedback-text">
                {timeLeft === 0 ? 'Tempo esgotado!' : 'Resposta incorreta!'}
              </span>
              <button className="show-explanation-btn" onClick={() => setShowExplanation(!showExplanation)}>
                {showExplanation ? 'Ocultar' : 'Ver'} explicação
              </button>
            </div>
          )}
          {showExplanation && (
            <div className="explanation-box animate-fadeInDown">
              <pre className="explanation-text">{question.explanation}</pre>
            </div>
          )}
          <button className="chalk-btn chalk-btn-green next-btn" onClick={handleNext}>
            {currentQ + 1 >= questions.length ? '📊 Ver Resultado' : '→ Próxima'}
          </button>
        </div>
      )}
    </div>
  );
}
