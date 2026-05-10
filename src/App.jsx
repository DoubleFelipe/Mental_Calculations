/**
 * Mental Calculations — App Principal
 * Roteamento entre telas e gerenciamento de estado global
 */
import React, { useState, useCallback } from 'react';
import { GameProvider } from './hooks/useGameState';
import useGameState from './hooks/useGameState';
import MainMenu from './pages/MainMenu/MainMenu';
import WorldSelect from './pages/WorldSelect/WorldSelect';
import PlatformGame from './pages/PlatformGame/PlatformGame';
import Quiz from './pages/Quiz/Quiz';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Shop from './pages/Shop/Shop';
import Victory from './pages/Results/Victory';
import Defeat from './pages/Results/Defeat';

/** Componente que processa resultado e mostra vitória ou derrota */
function ResultScreen({ worldIndex, levelIndex, result, onContinue, onRetry, onMenu }) {
  const { completeLevelAction } = useGameState();

  // Processa resultado uma única vez
  const [data] = useState(() => {
    if (!result) return { passed: false, stars: 0, score: 0, credits: 0 };
    return completeLevelAction(worldIndex, levelIndex, result.correct, result.total, result.avgTime);
  });

  if (!result) return null;

  if (data.passed) {
    return (
      <Victory
        stars={data.stars}
        score={data.score}
        credits={data.credits}
        correct={result.correct}
        total={result.total}
        onContinue={onContinue}
        onRetry={onRetry}
      />
    );
  }
  return (
    <Defeat
      correct={result.correct}
      total={result.total}
      onRetry={onRetry}
      onMenu={onMenu}
    />
  );
}

/** Conteúdo principal (dentro do GameProvider) */
function AppContent() {
  const [currentPage, setCurrentPage] = useState('mainMenu');
  const [selectedWorld, setSelectedWorld] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [quizKey, setQuizKey] = useState(0);

  const navigate = useCallback((page) => { setCurrentPage(page); }, []);

  const handleSelectWorld = useCallback((worldIndex) => {
    setSelectedWorld(worldIndex);
    setSelectedLevel(0);
    setCurrentPage('platformGame');
  }, []);

  const handleStartQuiz = useCallback((worldIndex, levelIndex) => {
    setSelectedWorld(worldIndex);
    setSelectedLevel(levelIndex);
    setQuizKey(Date.now());
    setCurrentPage('quiz');
  }, []);

  const handleQuizComplete = useCallback((correct, total, avgTime) => {
    setQuizResult({ correct, total, avgTime });
    setCurrentPage('result');
  }, []);

  const handleRetry = useCallback(() => {
    setQuizKey(Date.now());
    setQuizResult(null);
    setCurrentPage('quiz');
  }, []);

  switch (currentPage) {
    case 'mainMenu':
      return <MainMenu onNavigate={navigate} />;
    case 'worldSelect':
      return <WorldSelect onNavigate={navigate} onSelectWorld={handleSelectWorld} />;
    case 'platformGame':
      return <PlatformGame worldIndex={selectedWorld} levelIndex={selectedLevel} onStartQuiz={handleStartQuiz} onNavigate={navigate} />;
    case 'quiz':
      return <Quiz key={quizKey} worldIndex={selectedWorld} levelIndex={selectedLevel} onComplete={handleQuizComplete} />;
    case 'result':
      return <ResultScreen key={quizKey} worldIndex={selectedWorld} levelIndex={selectedLevel} result={quizResult} onContinue={() => navigate('worldSelect')} onRetry={handleRetry} onMenu={() => navigate('mainMenu')} />;
    case 'profile':
      return <Profile onNavigate={navigate} />;
    case 'settings':
      return <Settings onNavigate={navigate} />;
    case 'shop':
      return <Shop onNavigate={navigate} />;
    case 'exit':
      return (
        <div className="chalkboard chalkboard-frame" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
          <h2 className="chalk-text-strong" style={{ fontSize: '2rem' }}>👋 Até logo!</h2>
          <p className="chalk-text" style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem' }}>Obrigado por jogar Mental Calculations!</p>
          <button className="chalk-btn chalk-btn-green" onClick={() => navigate('mainMenu')}>Voltar ao Menu</button>
        </div>
      );
    default:
      return <MainMenu onNavigate={navigate} />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
