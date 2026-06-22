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

export default function useQuizController({ worldIndex, levelIndex, onComplete }) {
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

  const startQuiz = () => {
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
  };
}
