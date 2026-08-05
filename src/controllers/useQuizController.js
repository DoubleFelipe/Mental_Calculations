/**
 * Mental Calculations — Quiz Controller
 * Controla a lógica da partida de quiz, cronômetro, áudios e pontuação.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuestionSet, getTimeLimit } from '../services/mathGenerator';
import { getLevelDifficulty } from '../models/GameModel';
import useGameState from './GameController';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import worlds from '../data/worlds';
import { progressApi, shopApi } from '../services/apiService';

export default function useQuizController({ worldIndex, levelIndex, onComplete }) {
  const { settings, gameState, consumePowerUp, isOnline } = useGameState();
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
  const [hiddenAlternatives, setHiddenAlternatives] = useState([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [creditMultiplier, setCreditMultiplier] = useState(1);
  const [powerUpMessage, setPowerUpMessage] = useState('');
  const questionStartRef = useRef(null);
  const attemptIdRef = useRef(null);

  const registerWrongAnswer = useCallback((elapsed) => {
    if (shieldActive) {
      setShieldActive(false);
      setIsCorrect(true);
      setPowerUpMessage('🛡️ O escudo protegeu este erro!');
      setScore(prev => ({ ...prev, correct: prev.correct + 1, times: [...prev.times, elapsed] }));
      return;
    }
    setIsCorrect(false);
    setScore(prev => ({ ...prev, wrong: prev.wrong + 1, times: [...prev.times, elapsed] }));
  }, [shieldActive]);

  const handleTimeUp = useCallback(() => {
    if (showFeedback) return;
    setShowFeedback(true);
    registerWrongAnswer(timeLimit * 1000);
    playWrong();
  }, [showFeedback, timeLimit, playWrong, registerWrongAnswer]);

  const { timeLeft, percentage, start, reset, addTime } = useTimer(timeLimit, handleTimeUp);

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
      registerWrongAnswer(elapsed);
    }
  };

  const activatePowerUp = (itemId) => {
    if (showFeedback || (gameState.powerUpUses?.[itemId] || 0) <= 0) return;
    if (!consumePowerUp(itemId)) return;
    if (itemId === 'item_hint') {
      const incorrect = questions[currentQ].alternatives
        .map((_, index) => index)
        .filter((index) => index !== questions[currentQ].correctIndex && !hiddenAlternatives.includes(index))
        .slice(0, 2);
      setHiddenAlternatives((prev) => [...prev, ...incorrect]);
      setPowerUpMessage('💡 Duas alternativas incorretas foram eliminadas.');
    }
    if (itemId === 'item_time') {
      addTime(15);
      setPowerUpMessage('⏰ +15 segundos adicionados.');
    }
    if (itemId === 'item_shield') {
      setShieldActive(true);
      setPowerUpMessage('🛡️ Escudo ativo para esta questão.');
    }
    if (itemId === 'item_double') {
      setCreditMultiplier(2);
      setPowerUpMessage('✨ Créditos desta fase serão dobrados.');
    }
    if (isOnline && itemId !== 'item_double') shopApi.consumePowerUp(itemId).catch(() => {});
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      // Quiz finalizado
      // O backend armazena duração em milissegundos inteiros.
      const avgTime = score.times.length > 0
        ? Math.round(score.times.reduce((a, b) => a + b, 0) / score.times.length)
        : 0;
      onComplete(score.correct, questions.length, avgTime, creditMultiplier, attemptIdRef.current);
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setHiddenAlternatives([]);
    setShieldActive(false);
    setPowerUpMessage('');
    reset(timeLimit);
  };

  const startQuiz = async () => {
    if (isOnline) {
      try {
        const levelId = worldIndex * 5 + levelIndex + 1;
        const attempt = await progressApi.startLevel(levelId);
        attemptIdRef.current = attempt.attemptId;
      } catch (error) {
        setPowerUpMessage(`Sessão online indisponível: ${error.message}`);
      }
    }
    setShowIntro(false);
  };

  return {
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
    activatePowerUp,
    hiddenAlternatives,
    shieldActive,
    powerUpMessage,
    powerUpUses: gameState.powerUpUses || {},
  };
}
