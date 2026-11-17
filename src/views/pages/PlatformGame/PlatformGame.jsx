/**
 * Mental Calculations — Tela da Plataforma 2D
 * Controla o canvas do jogo + HUD + pause
 */
import { useState, useCallback } from 'react';
import GameCanvas from '../../../engine/GameCanvas';
import useGameState from '../../../controllers/GameController';
import worlds from '../../../data/worlds';
import { getNPCStoryScenes, getPendingStoryEvents, getStoryPlayerKey, getStoryProgress } from '../../../models/StoryModel';
import { StoryDialog, StoryEvents, StoryHeart } from '../../components/Story/StoryDialog';
import './PlatformGame.css';

const EMPTY_COLLECTED_MONEY_BAGS = [];

export default function PlatformGame({ worldIndex, onStartQuiz, onNavigate }) {
  const { gameState, authUser, settings, loseLife, resetLives, saveWorldPosition, clearWorldPosition, collectMoneyBag } = useGameState();
  const [isPaused, setIsPaused] = useState(false);
  const [dialogue, setDialogue] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const world = worlds[worldIndex];
  const savedPosition = gameState.worldPositions?.[worldIndex] || null;

  const storyProgress = getStoryProgress(gameState);
  const hasStoryEvent = getPendingStoryEvents(gameState, getStoryPlayerKey(authUser), { worldIndex }).length > 0;

  const handleNPCInteract = useCallback((character, playerPos) => {
    const pos = playerPos || { x: character.x, y: character.y };
    if (saveWorldPosition) {
      saveWorldPosition(worldIndex, pos);
    }
    setDialogue(character);
  }, [worldIndex, saveWorldPosition]);

  const handlePlayerHit = useCallback(() => {
    if (gameState.lives <= 1) setIsGameOver(true);
    loseLife();
  }, [gameState.lives, loseLife]);

  const restartAfterGameOver = useCallback(() => {
    resetLives();
    if (clearWorldPosition) {
      clearWorldPosition(worldIndex);
    }
    setIsGameOver(false);
  }, [resetLives, clearWorldPosition, worldIndex]);

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
          <span className="hud-level">Léo · Explore Numeria com os 5 guardiões</span>
        </div>
        <div className="hud-right">
          <StoryHeart fragments={storyProgress.fragments} compact />
          <button className="hud-pause-btn" onClick={() => setIsPaused(true)}>⏸️</button>
        </div>
      </div>

      {/* Canvas do Jogo */}
      <div className="game-canvas-container">
        <GameCanvas
          worldIndex={worldIndex}
          initialPosition={savedPosition}
          onNPCInteract={handleNPCInteract}
          onPlayerHit={handlePlayerHit}
          onMoneyBagCollect={collectMoneyBag}
          collectedMoneyBags={gameState.collectedMoneyBags || EMPTY_COLLECTED_MONEY_BAGS}
          levelProgress={levelProgress}
          isPaused={isPaused || Boolean(dialogue) || isGameOver || hasStoryEvent}
          equippedSkin={gameState.equippedSkin}
          doubleJumpEnabled={Boolean(settings.doubleJump)}
          difficulty={settings.difficulty}
        />
      </div>

      {/* Instruções mobile */}
      <div className="game-instructions">
        <span>🎮 Use A/D ou ← → para mover | Espaço para pular | E para conversar</span>
      </div>

      {dialogue && (
        <StoryDialog
          scenes={getNPCStoryScenes(dialogue, worldIndex, gameState)}
          fragments={storyProgress.fragments}
          finishLabel={dialogue.locked ? 'Voltar ao mapa' : 'Iniciar desafio →'}
          onCancel={() => setDialogue(null)}
          skippable={false}
          onComplete={() => {
            if (!dialogue.locked) onStartQuiz(worldIndex, dialogue.levelIndex);
            setDialogue(null);
          }}
        />
      )}
      <StoryEvents worldIndex={worldIndex} />

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
      {isGameOver && (
        <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="Fim de jogo">
          <div className="pause-modal chalkboard animate-scaleIn">
            <h2 className="chalk-text-strong">Fim de jogo</h2>
            <p className="chalk-text">Suas vidas acabaram. Tente novamente com 3 vidas.</p>
            <div className="pause-buttons">
              <button className="chalk-btn chalk-btn-green" onClick={restartAfterGameOver}>Recomeçar mapa</button>
              <button className="chalk-btn chalk-btn-yellow" onClick={() => { resetLives(); onNavigate('worldSelect'); }}>Mundos</button>
              <button className="chalk-btn chalk-btn-red" onClick={() => { resetLives(); onNavigate('mainMenu'); }}>Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
