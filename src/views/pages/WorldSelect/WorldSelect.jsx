/**
 * Mental Calculations — Seleção de Mundo
 */
import { useState } from 'react';
import useGameState from '../../../controllers/GameController';
import worlds from '../../../data/worlds';
import './WorldSelect.css';

export default function WorldSelect({ onNavigate, onSelectWorld }) {
  const { gameState } = useGameState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const world = worlds[currentIndex];
  const isUnlocked = gameState.unlockedWorlds[currentIndex];
  const totalStars = gameState.levelStars[currentIndex].reduce((a, b) => a + b, 0);
  const maxStars = world.levels.length * 3;

  const goLeft = () => setCurrentIndex(prev => (prev - 1 + worlds.length) % worlds.length);
  const goRight = () => setCurrentIndex(prev => (prev + 1) % worlds.length);

  const handleSelectWorld = () => {
    if (!isUnlocked) return;
    onSelectWorld(currentIndex);
  };

  return (
    <div className="world-select chalkboard chalkboard-frame">
      <h2 className="chalk-text-strong world-select-title animate-fadeInDown">{world.name}</h2>
      <p className="chalk-text-dim world-subtitle">{world.subtitle}</p>

      <div className="world-carousel">
        <button className="chalk-arrow-btn" onClick={goLeft}>◀</button>

        <div className={`world-card animate-scaleIn ${!isUnlocked ? 'locked' : ''}`} onClick={handleSelectWorld}>
          <div className="world-icon">{isUnlocked ? world.icon : '🔒'}</div>
          <div className="world-stars">
            <span aria-hidden="true">★</span> {totalStars}/{maxStars}
          </div>
          <div className="world-progress">
            estrelas do mundo
          </div>
          <p className="world-hint">
            {isUnlocked ? 'Explore o mapa e converse com os 5 personagens' : 'Conclua o mundo anterior para desbloquear'}
          </p>
          {isUnlocked && <button className="chalk-btn chalk-btn-green world-play-btn" onClick={(event) => { event.stopPropagation(); handleSelectWorld(); }}>Explorar mundo</button>}
        </div>

        <button className="chalk-arrow-btn" onClick={goRight}>▶</button>
      </div>

      <div className="world-dots">
        {worlds.map((_, i) => (
          <span key={i} className={`dot ${i === currentIndex ? 'active' : ''}`} onClick={() => setCurrentIndex(i)} />
        ))}
      </div>

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
