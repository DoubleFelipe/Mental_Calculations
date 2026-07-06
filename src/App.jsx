/**
 * Mental Calculations — App Principal
 * Roteamento entre telas e gerenciamento de estado global.
 * Suporta autenticação Google OAuth + modo guest (sem login).
 */
import { useState, useCallback, useEffect } from 'react';
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
import { isAuthenticated, getStoredUser } from './services/authService';

/** Componente que processa resultado e mostra vitória ou derrota */
function ResultScreen({ worldIndex, levelIndex, result, onContinue, onRetry, onMenu }) {
  const { completeLevelAction } = useGameState();

  const [data] = useState(() => {
    if (!result) return { passed: false, stars: 0, score: 0, credits: 0 };
    // completeLevelAction agora é async, mas retorna um resultado local imediato
    return completeLevelAction(worldIndex, levelIndex, result.correct, result.total, result.avgTime);
  });

  // Aguardar resolução se for Promise
  const [resolved, setResolved] = useState(() => (
    data && typeof data.then === 'function' ? null : data
  ));

  useEffect(() => {
    if (data && typeof data.then === 'function') {
      let active = true;
      data.then((value) => {
        if (active) setResolved(value);
      });
      return () => {
        active = false;
      };
    }
  }, [data]);

  if (!result || !resolved) return null;

  if (resolved.passed) {
    return (
      <Victory
        stars={resolved.stars}
        score={resolved.score}
        credits={resolved.credits}
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
  const { handleLogin, handleLogout } = useGameState();

  // Determinar se o usuário já passou pela tela de login nesta sessão
  const [loginDone, setLoginDone] = useState(() => {
    // Se há callback OAuth na URL, processar imediatamente
    if (window.location.search.includes('token=') || window.location.search.includes('error=')) {
      return false; // vai mostrar a tela de Login para processar o callback
    }
    // Se já tem token ou usuário armazenado, pular login
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
    if (!user) {
      // Modo guest — marcar para não pedir login novamente nesta sessão
      localStorage.setItem('mc_guest_mode', 'true');
    } else {
      localStorage.removeItem('mc_guest_mode');
    }
    // Limpar URL (remover ?token= ou ?error=)
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

  // Mostrar login se ainda não passou pela tela
  if (!loginDone) {
    return <Login onAuthenticated={handleAuthDone} />;
  }

  switch (currentPage) {
    case 'mainMenu':
      return <MainMenu onNavigate={navigate} onLogout={handleLogoutDone} />;
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
