/**
 * Mental Calculations — Game Canvas (main game loop)
 * Renderiza o jogo 2D de plataforma dentro de um canvas React
 */
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { createPlayer, drawPlayer, updatePlayerAnimation } from './Player';
import { createWorldPlatforms, createWorldCharacters, createWorldHazards, drawPlatform, drawHazard, drawNPC } from './Platform';
import { drawBackground, drawHouse, drawCastle, drawWorldScenery } from './Background';
import { applyGravity, isOnPlatform, checkCollision, clampToLevel } from './Physics';

const LEVEL_WIDTH = 3220;
const LEVEL_HEIGHT = 620;
const INTERACTION_PADDING = 24;

function isNearCharacter(player, character) {
  return checkCollision(player, {
    x: character.x - INTERACTION_PADDING,
    y: character.y - 12,
    width: character.width + INTERACTION_PADDING * 2,
    height: character.height + 24,
  });
}

export default function GameCanvas({ worldIndex, levelProgress, onNPCInteract, onPlayerHit, isPaused, equippedSkin, doubleJumpEnabled = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const keysRef = useRef({});
  const playerRef = useRef(createPlayer(80, 440));
  const platforms = useMemo(() => createWorldPlatforms(worldIndex), [worldIndex]);
  const hazards = useMemo(() => createWorldHazards(worldIndex), [worldIndex]);
  const characters = useMemo(
    () => createWorldCharacters(platforms, worldIndex, levelProgress),
    [platforms, worldIndex, levelProgress],
  );
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
  const touchRef = useRef({ left: false, right: false, jump: false });
  const interactCooldownRef = useRef(0);
  const hazardCooldownRef = useRef(0);
  const jumpLatchRef = useRef(false);

  // Redimensionar canvas
  useEffect(() => {
    function resize() {
      const w = Math.min(window.innerWidth, 1200);
      const h = Math.min(window.innerHeight * 0.7, 540);
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
      const jumpPressed = jump && !jumpLatchRef.current;
      jumpLatchRef.current = jump;

      player.isWalking = false;
      if (moveLeft) { player.vx = -player.speed; player.facingRight = false; player.isWalking = true; }
      if (moveRight) { player.vx = player.speed; player.facingRight = true; player.isWalking = true; }
      if (jumpPressed && (player.isGrounded || (doubleJumpEnabled && player.jumpCount === 1))) {
        const jumpingFromGround = player.isGrounded;
        player.vy = player.jumpForce;
        player.isGrounded = false;
        player.jumpCount = jumpingFromGround ? 1 : 2;
      }
      if (touch.jump) touch.jump = false; // Single tap jump

      // Física
      applyGravity(player);
      updatePlayerAnimation(player);

      // Atualiza a posição lógica das plataformas móveis para que o desafio
      // visual e a colisão permaneçam sincronizados.
      platforms.forEach((plat) => {
        if (plat.moving) plat.x = plat.baseX + Math.sin((performance.now() / 900) + plat.baseX) * plat.range;
      });

      // Colisão com plataformas
      player.isGrounded = false;
      for (const plat of platforms) {
        if (isOnPlatform(player, plat)) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.jumpCount = 0;
        }
      }

      // Espinhos funcionais: perdem uma vida e reposicionam o jogador no spawn.
      if (hazardCooldownRef.current > 0) hazardCooldownRef.current--;
      if (hazardCooldownRef.current <= 0 && hazards.some((hazard) => checkCollision(player, hazard))) {
        hazardCooldownRef.current = 45;
        player.x = 80;
        player.y = 440;
        player.vx = 0;
        player.vy = 0;
        player.jumpCount = 0;
        onPlayerHit?.();
      }

      // Limites do nível
      clampToLevel(player, LEVEL_WIDTH, LEVEL_HEIGHT);
      if (player.y > LEVEL_HEIGHT - 50) {
        player.y = 440;
        player.x = 80;
        player.vy = 0;
        player.jumpCount = 0;
      }

      // Camera
      const cameraX = Math.max(0, Math.min(player.x - canvasSize.width / 2 + player.width / 2, LEVEL_WIDTH - canvasSize.width));
      const cameraY = Math.max(0, Math.min(player.y - canvasSize.height / 2, LEVEL_HEIGHT - canvasSize.height));

      // Interação com portais/NPCs (cooldown)
      if (interactCooldownRef.current > 0) interactCooldownRef.current--;
      const interact = keys['e'] || keys['enter'];
      if (interact && interactCooldownRef.current <= 0) {
        for (const p of characters) {
          if (!p.activated && isNearCharacter(player, p)) {
            interactCooldownRef.current = 30;
            if (!p.locked) p.activated = true;
            onNPCInteract?.(p);
            break;
          }
        }
      }

      // === Renderização ===
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      drawBackground(ctx, canvasSize.width, canvasSize.height, cameraX, frame);
      drawWorldScenery(ctx, cameraX, cameraY, platforms);

      // Casa de nascimento no início e castelo de conclusão no fim.
      drawHouse(ctx, 110, 520, cameraX, cameraY);
      drawCastle(ctx, 3000, 520, cameraX, cameraY, frame);

      // Plataformas
      for (const plat of platforms) drawPlatform(ctx, plat, cameraX, cameraY);

      // Perigos: a densidade aumenta a partir da segunda área.
      for (const hazard of hazards) drawHazard(ctx, hazard, cameraX, cameraY);

      // Cinco personagens que dão acesso às fases do mundo
      for (const p of characters) drawNPC(ctx, p, cameraX, cameraY, frame);

      // Player
      drawPlayer(ctx, player, cameraX, cameraY, equippedSkin);

      // Instrução de interação
      for (const p of characters) {
        if (!p.activated && isNearCharacter(player, p)) {
          const px = p.x + p.width / 2 - cameraX;
          const py = p.y - 20 - cameraY;
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.beginPath();
          ctx.roundRect(px - 40, py - 12, 80, 20, 6);
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.locked ? 'Bloqueado' : 'Pressione E', px, py + 2);
        }
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, platforms, hazards, characters, canvasSize, onNPCInteract, onPlayerHit, equippedSkin, doubleJumpEnabled]);

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
