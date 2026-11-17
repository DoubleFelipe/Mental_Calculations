/**
 * Mental Calculations — Seleção de Mundo
 */
import { useState } from 'react';
import useGameState from '../../../controllers/GameController';
import worlds from '../../../data/worlds';
import { FRAGMENTS, INTRO_SCENES, ENDING_SCENES, WORLD_STORIES } from '../../../data/story';
import { getStoryProgress } from '../../../models/StoryModel';
import { StoryDialog, StoryEvents, StoryHeart } from '../../components/Story/StoryDialog';
import './WorldSelect.css';

export default function WorldSelect({ onNavigate, onSelectWorld }) {
  const { gameState } = useGameState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replay, setReplay] = useState(null);
  const storyProgress = getStoryProgress(gameState);

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
      <StoryHeart fragments={storyProgress.fragments} compact />
      <p className="story-objective"><strong>{storyProgress.completed ? 'Numeria restaurada' : WORLD_STORIES[currentIndex].title}</strong><br />{storyProgress.completed ? 'O Coração voltou a pulsar! Revisite os guardiões e continue descobrindo a Matemática.' : WORLD_STORIES[currentIndex].objective}</p>

      <div className="world-carousel">
        <button className="chalk-arrow-btn" onClick={goLeft}>◀</button>

        <div className={`world-card animate-scaleIn ${!isUnlocked ? 'locked' : ''}`}>
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
          <button
            key={i}
            type="button"
            className={`dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Mostrar mundo ${i + 1}`}
            aria-current={i === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>

      <details className="story-journal">
        <summary>📖 Diário de Léo {storyProgress.completed ? '· Guardião dos Números' : '· Coração dos Cálculos'}</summary>
        <ol>{FRAGMENTS.map((fragment) => <li key={fragment.id}>
          {storyProgress.fragments.some((item) => item.id === fragment.id) ? '◆ Recuperado' : '◇ A encontrar'}: {fragment.name} · {worlds[fragment.world].name}, fase {fragment.level + 1}
        </li>)}</ol>
        <button className="story-skip" onClick={() => setReplay('intro')}>Rever introdução</button>
        {storyProgress.completed && <button className="story-skip" onClick={() => setReplay('ending')}>Rever final</button>}
      </details>
      <StoryEvents intro />
      {replay && <StoryDialog scenes={replay === 'ending' ? ENDING_SCENES : INTRO_SCENES} fragments={storyProgress.fragments} onComplete={() => setReplay(null)} finishLabel="Voltar aos mundos" />}

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
