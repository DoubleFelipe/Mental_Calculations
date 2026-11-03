/**
 * Mental Calculations — Quiz Controller
 * Controla a lógica da partida de quiz, cronômetro, áudios, diagnósticos pedagógicos e pontuação.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuestionSet } from '../services/mathGenerator';
import { getLevelDifficulty } from '../models/GameModel';
import { getDifficultyLabel, getQuestionTimeLimit } from '../models/SettingsModel';
import useGameState from './GameController';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import worlds from '../data/worlds';
import { progressApi, shopApi } from '../services/apiService';

export default function useQuizController({ worldIndex, levelIndex, onComplete }) {
  const { settings, gameState, consumePowerUp, isOnline, recordConceptualError } = useGameState();
  const { playCorrect, playWrong } = useAudio(settings);

  const difficulty = getLevelDifficulty(worldIndex, levelIndex);
  const world = worlds[worldIndex];
  const level = world?.levels[levelIndex];
  const questionsCount = level?.questionsCount || 5;
  const selectedDifficulty = settings.difficulty;
  const selectedDifficultyLabel = getDifficultyLabel(selectedDifficulty);
  const timeLimit = getQuestionTimeLimit(selectedDifficulty);

  // Geração acoplada com a matriz pedagógica da fase
  const [questions, setQuestions] = useState(() =>
    generateQuestionSet(questionsCount, difficulty, worldIndex, levelIndex)
  );

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0, times: [] });
  const [showExplanation, setShowExplanation] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [hiddenAlternatives, setHiddenAlternatives] = useState([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [creditMultiplier, setCreditMultiplier] = useState(1);
  const [powerUpMessage, setPowerUpMessage] = useState('');
  const [isApprenticeMode, setIsApprenticeMode] = useState(false);

  // Ciclo de Revisão e Repescagem (Mastery Learning)
  const [reviewQueue, setReviewQueue] = useState([]);
  const [isReviewPhase, setIsReviewPhase] = useState(false);
  const [reviewSuccessCount, setReviewSuccessCount] = useState(0);

  const questionStartRef = useRef(null);
  const attemptIdRef = useRef(null);

  const registerWrongAnswer = useCallback(
    (elapsed, chosenIndex) => {
      const q = questions[currentQ];
      const diag = q?.diagnostics?.[chosenIndex] || null;
      setSelectedDiagnostic(diag);

      // CORREÇÃO CRÍTICA DO ESCUDO:
      // O escudo concede uma SEGUNDA CHANCE ativa e elimina o distrator,
      // mas NUNCA transforma um erro em acerto automático no score!
      if (shieldActive) {
        setShieldActive(false);
        setPowerUpMessage('🛡️ O escudo protegeu seu progresso! Você ganhou uma segunda chance: a opção incorreta foi eliminada.');
        if (chosenIndex !== undefined && chosenIndex !== null) {
          setHiddenAlternatives((prev) => [...prev, chosenIndex]);
        }
        setSelected(null);
        setShowFeedback(false);
        setIsCorrect(false);
        return false;
      }

      setIsCorrect(false);
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1, times: [...prev.times, elapsed] }));

      // Registrar questão para o ciclo de revisão se não estivermos já na repescagem
      if (!isReviewPhase && q) {
        setReviewQueue((prev) => [...prev, { question: q, chosenIndex, diagnostic: diag }]);
        if (recordConceptualError) {
          recordConceptualError({
            topic: q.topic || 'Equação Quadrática',
            questionText: q.text,
            wrongAnswer: q.alternatives?.[chosenIndex],
            correctAnswer: q.correctAnswer,
            diagnostic: diag,
          });
        }
      }

      return true;
    },
    [shieldActive, questions, currentQ, isReviewPhase, recordConceptualError]
  );

  const handleTimeUp = useCallback(() => {
    if (showFeedback || isApprenticeMode) return;
    setShowFeedback(true);
    registerWrongAnswer(timeLimit * 1000, null);
    playWrong();
  }, [showFeedback, isApprenticeMode, timeLimit, playWrong, registerWrongAnswer]);

  const { timeLeft, percentage, start, pause, reset, addTime } = useTimer(timeLimit, handleTimeUp);

  useEffect(() => {
    if (!showIntro && !isApprenticeMode) {
      questionStartRef.current = Date.now();
      start();
    }
  }, [currentQ, showIntro, isApprenticeMode]); // eslint-disable-line

  const pauseTimer = useCallback(() => {
    pause();
  }, [pause]);

  const resumeTimer = useCallback(() => {
    if (!isApprenticeMode && !showFeedback && !showIntro) {
      start();
    }
  }, [isApprenticeMode, showFeedback, showIntro, start]);

  const toggleApprenticeMode = useCallback(() => {
    setIsApprenticeMode((prev) => {
      const next = !prev;
      if (next) {
        pause();
      } else {
        start();
      }
      return next;
    });
  }, [pause, start]);

  const handleAnswer = (index) => {
    if (showFeedback || selected !== null) return;
    const elapsed = Date.now() - (questionStartRef.current || Date.now());
    setSelected(index);

    const q = questions[currentQ];
    const correct = index === q.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrect();
      setShowFeedback(true);
      setSelectedDiagnostic(null);
      if (isReviewPhase) {
        setReviewSuccessCount((prev) => prev + 1);
      }
      setScore((prev) => ({ ...prev, correct: prev.correct + 1, times: [...prev.times, elapsed] }));
    } else {
      playWrong();
      const errorCommitted = registerWrongAnswer(elapsed, index);
      if (errorCommitted) {
        setShowFeedback(true);
      }
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
      setPowerUpMessage('🛡️ Escudo ativo: protege contra o próximo erro concedendo uma Segunda Chance.');
    }
    if (itemId === 'item_double') {
      setCreditMultiplier(2);
      setPowerUpMessage('✨ Créditos desta fase serão dobrados.');
    }
    if (isOnline && itemId !== 'item_double') shopApi.consumePowerUp(itemId).catch(() => {});
  };

  const handleNext = () => {
    // Se a questão atual for a última da lista
    if (currentQ + 1 >= questions.length) {
      // Se tiver erros registrados e ainda não fizemos a repescagem pedagógica
      if (!isReviewPhase && reviewQueue.length > 0) {
        setIsReviewPhase(true);
        setQuestions(reviewQueue.map((item) => item.question));
        setCurrentQ(0);
        setSelected(null);
        setShowFeedback(false);
        setIsCorrect(false);
        setSelectedDiagnostic(null);
        setShowExplanation(false);
        setHiddenAlternatives([]);
        setShieldActive(false);
        setPowerUpMessage('🔄 Rodada de Fixação: Refaça os pontos onde houve dúvida para consolidar o aprendizado!');
        reset(timeLimit);
        return;
      }

      // Quiz finalizado completamente (incluindo rodada de fixação)
      const avgTime = score.times.length > 0
        ? Math.round(score.times.reduce((a, b) => a + b, 0) / score.times.length)
        : 0;

      // Se passou na repescagem, pode conceder estrelas baseadas no resultado consolidado
      const finalCorrect = score.correct;
      const initialTotal = questionsCount;
      onComplete(finalCorrect, initialTotal, avgTime, creditMultiplier, attemptIdRef.current);
      return;
    }

    // Avançar para a próxima questão
    setCurrentQ((prev) => prev + 1);
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setSelectedDiagnostic(null);
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
    selectedDifficulty,
    selectedDifficultyLabel,
    questionsCount,
    timeLimit,
    questions,
    currentQ,
    selected,
    showFeedback,
    isCorrect,
    selectedDiagnostic,
    score,
    showExplanation,
    setShowExplanation,
    showIntro,
    startQuiz,
    timeLeft,
    percentage,
    pauseTimer,
    resumeTimer,
    isApprenticeMode,
    toggleApprenticeMode,
    isReviewPhase,
    reviewSuccessCount,
    handleAnswer,
    handleNext,
    activatePowerUp,
    hiddenAlternatives,
    shieldActive,
    powerUpMessage,
    powerUpUses: gameState.powerUpUses || {},
  };
}
