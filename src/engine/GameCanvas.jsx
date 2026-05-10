/**
 * Mental Calculations — Game Canvas (main game loop)
 * Renderiza o jogo 2D de plataforma dentro de um canvas React
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPlayer, drawPlayer, updatePlayerAnimation } from './Player';
import { createLevelPlatforms, createPortals, drawPlatform, drawNPC, drawPortal } from './Platform';
import { drawBackground, drawHouse } from './Background';
import { applyGravity, isOnPlatform, checkCollision, clampToLevel } from './Physics';

const LEVEL_WIDTH = 1600;
const LEVEL_HEIGHT = 500;

export default function GameCanvas({ worldIndex, levelIndex, onPortalEnter, onNPCInteract, isPaused, equippedSkin }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const keysRef = useRef({});
  const playerRef = useRef(createPlayer(50, 300));
  const [platforms] = useState(() => createLevelPlatforms(levelIndex));
  const [portals] = useState(() => createPortals(platforms));
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 });
  const touchRef = useRef({ left: false, right: false, jump: false });
  const interactCooldownRef = useRef(0);

  // Redimensionar canvas
  useEffect(() => {
    function resize() {
      const w = Math.min(window.innerWidth, 1200);
      const h = Math.min(window.innerHeight * 0.65, 500);
      setCanvasSize({ width: w, height: h });
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const onDown = (e) => { keysRef.current[e.key.toLowerCase()] = true; };
    const onUp = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Controles touch
  const handleTouch = useCallback((dir, pressed) => {
    touchRef.current[dir] = pressed;
  }, []);

  // Game loop
  useEffect(() => {
    if (isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    function loop() {
      const player = playerRef.current;
      const keys = keysRef.current;
      const touch = touchRef.current;
      const frame = frameRef.current++;

      // Input
      const moveLeft = keys['a'] || keys['arrowleft'] || touch.left;
      const moveRight = keys['d'] || keys['arrowright'] || touch.right;
      const jump = keys[' '] || keys['w'] || keys['arrowup'] || touch.jump;

      player.isWalking = false;
      if (moveLeft) { player.vx = -player.speed; player.facingRight = false; player.isWalking = true; }
      if (moveRight) { player.vx = player.speed; player.facingRight = true; player.isWalking = true; }
      if (jump && player.isGrounded) { player.vy = player.jumpForce; player.isGrounded = false; }
      if (touch.jump) touch.jump = false; // Single tap jump

      // Física
      applyGravity(player);
      updatePlayerAnimation(player);

      // Colisão com plataformas
      player.isGrounded = false;
      for (const plat of platforms) {
        if (isOnPlatform(player, plat)) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
        }
      }

      // Limites do nível
      clampToLevel(player, LEVEL_WIDTH, LEVEL_HEIGHT);
      if (player.y > LEVEL_HEIGHT - 50) {
        player.y = 300;
        player.x = 50;
        player.vy = 0;
      }

      // Camera
      const cameraX = Math.max(0, Math.min(player.x - canvasSize.width / 2 + player.width / 2, LEVEL_WIDTH - canvasSize.width));
      const cameraY = Math.max(0, Math.min(player.y - canvasSize.height / 2, LEVEL_HEIGHT - canvasSize.height));

      // Interação com portais/NPCs (cooldown)
      if (interactCooldownRef.current > 0) interactCooldownRef.current--;
      const interact = keys['e'] || keys['enter'];
      if (interact && interactCooldownRef.current <= 0) {
        for (const p of portals) {
          if (!p.activated && checkCollision(player, p)) {
            interactCooldownRef.current = 30;
            p.activated = true;
            if (p.type === 'portal') { onPortalEnter?.(); }
            else { onNPCInteract?.(p); }
            break;
          }
        }
      }

      // === Renderização ===
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      drawBackground(ctx, canvasSize.width, canvasSize.height, cameraX, frame);

      // Casa decorativa
      drawHouse(ctx, LEVEL_WIDTH - 200, platforms[platforms.length - 1]?.y || 400, cameraX);

      // Plataformas
      for (const plat of platforms) drawPlatform(ctx, plat, cameraX, cameraY);

      // Portais/NPCs
      for (const p of portals) {
        if (p.type === 'portal') drawPortal(ctx, p, cameraX, cameraY, frame);
        else drawNPC(ctx, p, cameraX, cameraY, frame);
      }

      // Player
      const skinColor = equippedSkin === 'default' ? '#222' : '#1976D2';
      drawPlayer(ctx, player, cameraX, cameraY, skinColor);

      // Instrução de interação
      for (const p of portals) {
        if (!p.activated && checkCollision(player, p)) {
          const px = p.x + p.width / 2 - cameraX;
          const py = p.y - 20 - cameraY;
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.beginPath();
          ctx.roundRect(px - 40, py - 12, 80, 20, 6);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Pressione E', px, py + 2);
        }
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, platforms, portals, canvasSize, onPortalEnter, onNPCInteract, equippedSkin]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ display: 'block', margin: '0 auto', borderRadius: '8px', border: '3px solid #5C2E0A' }}
      />
      {/* Controles mobile */}
      <div className="mobile-controls" style={{ display: 'none' }}>
        <button className="mobile-btn mobile-left"
          onTouchStart={() => handleTouch('left', true)}
          onTouchEnd={() => handleTouch('left', false)}
          onMouseDown={() => handleTouch('left', true)}
          onMouseUp={() => handleTouch('left', false)}>◀</button>
        <button className="mobile-btn mobile-right"
          onTouchStart={() => handleTouch('right', true)}
          onTouchEnd={() => handleTouch('right', false)}
          onMouseDown={() => handleTouch('right', true)}
          onMouseUp={() => handleTouch('right', false)}>▶</button>
        <button className="mobile-btn mobile-jump"
          onTouchStart={() => handleTouch('jump', true)}
          onMouseDown={() => handleTouch('jump', true)}>▲</button>
        <button className="mobile-btn mobile-interact"
          onTouchStart={() => { keysRef.current['e'] = true; setTimeout(() => keysRef.current['e'] = false, 100); }}
          onMouseDown={() => { keysRef.current['e'] = true; setTimeout(() => keysRef.current['e'] = false, 100); }}>E</button>
      </div>
    </div>
  );
}
