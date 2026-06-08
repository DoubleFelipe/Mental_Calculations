/**
 * Mental Calculations — Tela de Quiz
 * Mostra questões uma por vez com timer e feedback
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuestionSet, getTimeLimit } from '../../services/mathGenerator';
import { getLevelDifficulty } from '../../services/progressService';
import useGameState from '../../hooks/useGameState';
import useTimer from '../../hooks/useTimer';
import useAudio from '../../hooks/useAudio';
import worlds from '../../data/worlds';
import './Quiz.css';
import Whiteboard from '../../components/Whiteboard/Whiteboard.jsx';

export default function Quiz({ worldIndex, levelIndex, onComplete }) {
  const { settings } = useGameState();
  const { playCorrect, playWrong } = useAudio(settings);

  const difficulty = getLevelDifficulty(worldIndex, levelIndex);
  const world = worlds[worldIndex];
  const level = world?.levels[levelIndex];
  const questionsCount = level?.questionsCount || 5;
  const timeLimit = getTimeLimit(difficulty);

  const [questions] = useState(() => generateQuestionSet(questionsCount, difficulty));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0, times: [] });
  const [showExplanation, setShowExplanation] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const questionStartRef = useRef(Date.now());

  const handleTimeUp = useCallback(() => {
    if (showFeedback) return;
    setShowFeedback(true);
    setIsCorrect(false);
    setScore(prev => ({ ...prev, wrong: prev.wrong + 1, times: [...prev.times, timeLimit * 1000] }));
    playWrong();
  }, [showFeedback, timeLimit, playWrong]);

  const { timeLeft, percentage, start, reset } = useTimer(timeLimit, handleTimeUp);

  useEffect(() => {
    if (!showIntro) {
      questionStartRef.current = Date.now();
      start();
    }
  }, [currentQ, showIntro]); // eslint-disable-line

  const handleAnswer = (index) => {
    if (showFeedback || selected !== null) return;
    const elapsed = Date.now() - questionStartRef.current;
    setSelected(index);
    setShowFeedback(true);

    const correct = index === questions[currentQ].correctIndex;
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      setScore(prev => ({ ...prev, correct: prev.correct + 1, times: [...prev.times, elapsed] }));
    } else {
      playWrong();
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1, times: [...prev.times, elapsed] }));
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      // Quiz finalizado
      const avgTime = score.times.length > 0 ? score.times.reduce((a, b) => a + b, 0) / score.times.length : 0;
      onComplete(score.correct, questions.length, avgTime);
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowExplanation(false);
    reset(timeLimit);
  };

  const question = questions[currentQ];
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
          <button className="chalk-btn chalk-btn-green" onClick={() => setShowIntro(false)}>
            Começar! →
          </button>
        </div>
      </div>
    );
  }

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
