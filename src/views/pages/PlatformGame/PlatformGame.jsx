/**
 * Mental Calculations — Tela da Plataforma 2D
 * Controla o canvas do jogo + HUD + pause
 */
import { useEffect, useState, useCallback } from 'react';
import GameCanvas from '../../../engine/GameCanvas';
import useGameState from '../../../controllers/GameController';
import worlds from '../../../data/worlds';
import './PlatformGame.css';

export default function PlatformGame({ worldIndex, onStartQuiz, onNavigate }) {
  const { gameState, settings, loseLife } = useGameState();
  const [isPaused, setIsPaused] = useState(false);
  const [dialogue, setDialogue] = useState(null);

  const world = worlds[worldIndex];

  useEffect(() => {
    if (!dialogue) return undefined;

    const timer = window.setTimeout(() => {
      if (!dialogue.locked) onStartQuiz(worldIndex, dialogue.levelIndex);
      setDialogue(null);
    }, dialogue.locked ? 1800 : 1400);

    return () => window.clearTimeout(timer);
  }, [dialogue, onStartQuiz, worldIndex]);

  const handleNPCInteract = useCallback((character) => {
    setDialogue(character);
  }, []);

  const handlePlayerHit = useCallback(() => {
    loseLife();
  }, [loseLife]);

  const levelProgress = world?.levels.map((level, index) => ({
    levelIndex: index,
    levelName: level.name,
    stars: gameState.levelStars[worldIndex]?.[index] || 0,
    unlocked: gameState.unlockedLevels[worldIndex]?.[index] ?? false,
  })) || [];

  return (
    <div className="platform-game">
      {/* HUD */}
      <div className="game-hud">
        <div className="hud-left">
          <div className="hud-lives">
            {'❤️'.repeat(gameState.lives)}{'🖤'.repeat(3 - gameState.lives)}
          </div>
          <div className="hud-coins">💰 {gameState.credits}</div>
        </div>
        <div className="hud-center">
          <span className="hud-world">{world?.name}</span>
          <span className="hud-level">Mapa do mundo · 5 personagens</span>
        </div>
        <div className="hud-right">
          <button className="hud-pause-btn" onClick={() => setIsPaused(true)}>⏸️</button>
        </div>
      </div>

      {/* Canvas do Jogo */}
      <div className="game-canvas-container">
        <GameCanvas
          worldIndex={worldIndex}
          onNPCInteract={handleNPCInteract}
          onPlayerHit={handlePlayerHit}
          levelProgress={levelProgress}
          isPaused={isPaused || Boolean(dialogue)}
          equippedSkin={gameState.equippedSkin}
          doubleJumpEnabled={Boolean(settings.doubleJump)}
        />
      </div>

      {/* Instruções mobile */}
      <div className="game-instructions">
        <span>🎮 Use A/D ou ← → para mover | Espaço para pular | E para conversar</span>
      </div>

      {dialogue && (
        <div className="dialogue-overlay animate-fadeIn" role="dialog" aria-live="polite">
          <div className="dialogue-card chalkboard animate-scaleIn">
            <div className="dialogue-character">△</div>
            <div>
              <p className="dialogue-name">{dialogue.phaseName || dialogue.levelName}</p>
              <p className="dialogue-text">
                {dialogue.message}
              </p>
              {!dialogue.locked && <span className="dialogue-loading">A fase começará em instantes...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Tela de Pause */}
      {isPaused && (
        <div className="pause-overlay animate-fadeIn">
          <div className="pause-modal chalkboard animate-scaleIn">
            <h2 className="chalk-text-strong">⏸️ Pausado</h2>
            <div className="pause-buttons">
              <button className="chalk-btn chalk-btn-green" onClick={() => setIsPaused(false)}>▶ Continuar</button>
              <button className="chalk-btn chalk-btn-yellow" onClick={() => onNavigate('worldSelect')}>🗺️ Mundos</button>
              <button className="chalk-btn chalk-btn-red" onClick={() => onNavigate('mainMenu')}>🏠 Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
