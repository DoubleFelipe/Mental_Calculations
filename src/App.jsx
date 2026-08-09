import { useCallback, useEffect, useRef, useState } from 'react';
import { GameProvider } from './controllers/GameController';
import useGameState from './controllers/GameController';
import Login from './views/pages/Login/Login';
import MainMenu from './views/pages/MainMenu/MainMenu';
import WorldSelect from './views/pages/WorldSelect/WorldSelect';
import PlatformGame from './views/pages/PlatformGame/PlatformGame';
import Quiz from './views/pages/Quiz/Quiz';
import Profile from './views/pages/Profile/Profile';
import Settings from './views/pages/Settings/Settings';
import Shop from './views/pages/Shop/Shop';
import Victory from './views/pages/Results/Victory';
import Defeat from './views/pages/Results/Defeat';
import { getStoredUser, isAuthenticated } from './services/authService';

function ResultScreen({ worldIndex, levelIndex, result, onContinue, onRetry, onMenu }) {
  const { completeLevelAction } = useGameState();
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);
  const processedRef = useRef(false);
  const completeActionRef = useRef(completeLevelAction);

  useEffect(() => {
    completeActionRef.current = completeLevelAction;
  }, [completeLevelAction]);

  useEffect(() => {
    if (!result || processedRef.current) return undefined;

    processedRef.current = true;
    completeActionRef.current(
      worldIndex,
      levelIndex,
      result.correct,
      result.total,
      result.avgTime,
      result.creditMultiplier,
      result.attemptId,
    )
      .then(setResolved)
      .catch((err) => setError(err.message));

    return undefined;
  }, [levelIndex, result, worldIndex]);

  if (!result || (!resolved && !error)) {
    return <div className="result-page chalkboard chalkboard-frame"><p className="chalk-text">Calculando resultado...</p></div>;
  }
  if (error) return <Defeat correct={result.correct} total={result.total} error={error} onRetry={onRetry} onMenu={onMenu} />;

  return resolved.passed ? (
    <Victory
      stars={resolved.stars}
      score={resolved.score}
      credits={resolved.credits}
      correct={result.correct}
      total={result.total}
      syncWarning={resolved.syncWarning}
      onContinue={onContinue}
      onRetry={onRetry}
    />
  ) : (
    <Defeat correct={result.correct} total={result.total} onRetry={onRetry} onMenu={onMenu} />
  );
}

function AppContent() {
  const { handleLogin, handleLogout } = useGameState();
  const [loginDone, setLoginDone] = useState(() => {
    if (window.location.search.includes('token=') || window.location.search.includes('error=')) return false;
    return isAuthenticated() || getStoredUser() !== null || localStorage.getItem('mc_guest_mode') === 'true';
  });
  const [currentPage, setCurrentPage] = useState('mainMenu');
  const [selectedWorld, setSelectedWorld] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [quizKey, setQuizKey] = useState(0);

  const navigate = useCallback((page) => { setCurrentPage(page); }, []);
  const handleAuthDone = useCallback((user) => {
    handleLogin(user);
    if (!user) localStorage.setItem('mc_guest_mode', 'true');
    else localStorage.removeItem('mc_guest_mode');
    window.history.replaceState({}, document.title, '/');
    setLoginDone(true);
  }, [handleLogin]);
  const handleLogoutDone = useCallback(() => {
    handleLogout();
    localStorage.removeItem('mc_guest_mode');
    setCurrentPage('mainMenu');
    setLoginDone(false);
    window.history.replaceState({}, document.title, '/');
  }, [handleLogout]);
  const handleSelectWorld = useCallback((worldIndex) => {
    setSelectedWorld(worldIndex);
    setSelectedLevel(null);
    setCurrentPage('platformGame');
  }, []);
  const handleStartQuiz = useCallback((worldIndex, levelIndex) => {
    setSelectedWorld(worldIndex);
    setSelectedLevel(levelIndex);
    setQuizKey(Date.now());
    setCurrentPage('quiz');
  }, []);
  const handleQuizComplete = useCallback((correct, total, avgTime, creditMultiplier = 1, attemptId = null) => {
    setQuizResult({ correct, total, avgTime, creditMultiplier, attemptId });
    setCurrentPage('result');
  }, []);
  const handleRetry = useCallback(() => {
    setQuizKey(Date.now());
    setQuizResult(null);
    setCurrentPage('quiz');
  }, []);

  if (!loginDone) return <Login onAuthenticated={handleAuthDone} />;

  switch (currentPage) {
    case 'mainMenu': return <MainMenu onNavigate={navigate} onLogout={handleLogoutDone} />;
    case 'worldSelect': return <WorldSelect onNavigate={navigate} onSelectWorld={handleSelectWorld} />;
    case 'platformGame': return <PlatformGame worldIndex={selectedWorld} levelIndex={selectedLevel} onStartQuiz={handleStartQuiz} onNavigate={navigate} />;
    case 'quiz': return <Quiz key={quizKey} worldIndex={selectedWorld} levelIndex={selectedLevel} onComplete={handleQuizComplete} />;
    case 'result': return <ResultScreen key={quizKey} worldIndex={selectedWorld} levelIndex={selectedLevel} result={quizResult} onContinue={() => navigate('worldSelect')} onRetry={handleRetry} onMenu={() => navigate('mainMenu')} />;
    case 'profile': return <Profile onNavigate={navigate} />;
    case 'settings': return <Settings onNavigate={navigate} />;
    case 'shop': return <Shop onNavigate={navigate} />;
    case 'exit': return <div className="exit-page chalkboard chalkboard-frame"><h2 className="chalk-text-strong" style={{ fontSize: '2rem' }}>Até logo!</h2><p className="chalk-text" style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem' }}>Obrigado por jogar Mental Calculations!</p><button className="chalk-btn chalk-btn-green" onClick={() => navigate('mainMenu')}>Voltar ao Menu</button></div>;
    default: return <MainMenu onNavigate={navigate} />;
  }
}

export default function App() {
  return <GameProvider><AppContent /></GameProvider>;
}
