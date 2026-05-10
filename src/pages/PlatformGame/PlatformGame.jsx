/**
 * Mental Calculations — Tela da Plataforma 2D
 * Controla o canvas do jogo + HUD + pause
 */
import React, { useState, useCallback } from 'react';
import GameCanvas from '../../engine/GameCanvas';
import useGameState from '../../hooks/useGameState';
import worlds from '../../data/worlds';
import './PlatformGame.css';

export default function PlatformGame({ worldIndex, levelIndex, onStartQuiz, onNavigate }) {
  const { gameState } = useGameState();
  const [isPaused, setIsPaused] = useState(false);

  const world = worlds[worldIndex];
  const level = world?.levels[levelIndex];

  const handlePortalEnter = useCallback(() => {
    onStartQuiz(worldIndex, levelIndex);
  }, [worldIndex, levelIndex, onStartQuiz]);

  const handleNPCInteract = useCallback(() => {
    onStartQuiz(worldIndex, levelIndex);
  }, [worldIndex, levelIndex, onStartQuiz]);

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
          <span className="hud-level">Fase {levelIndex + 1}: {level?.name}</span>
        </div>
        <div className="hud-right">
          <button className="hud-pause-btn" onClick={() => setIsPaused(true)}>⏸️</button>
        </div>
      </div>

      {/* Canvas do Jogo */}
      <div className="game-canvas-container">
        <GameCanvas
          worldIndex={worldIndex}
          levelIndex={levelIndex}
          onPortalEnter={handlePortalEnter}
          onNPCInteract={handleNPCInteract}
          isPaused={isPaused}
          equippedSkin={gameState.equippedSkin}
        />
      </div>

      {/* Instruções mobile */}
      <div className="game-instructions">
        <span>🎮 Use A/D ou ← → para mover | Espaço para pular | E para interagir</span>
      </div>

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
