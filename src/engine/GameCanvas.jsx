/**
 * Mental Calculations — Game Canvas (main game loop)
 * Renderiza o jogo 2D de plataforma dentro de um canvas React
 */
import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { createPlayer, drawPlayer, updatePlayerAnimation } from './Player';
import {
  alignCharactersToPlatforms,
  createWorldPlatforms,
  updateWorldPlatforms,
  createWorldCharacters,
  createWorldHazards,
  drawPlatform,
  drawHazard,
  drawNPC,
} from './Platform';
import { drawBackground, drawHouse, drawCastle, drawWorldScenery } from './Background';
import { applyGravity, isOnPlatform, checkCollision, clampToLevel } from './Physics';
import { createWorldMoneyBags } from './MoneyBag';
import { WORLD_SECRET_AREAS, drawSecretEntrance, drawSecretDecorations } from './SecretAreas';

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

/** Desenha as plataformas secretas como nuvens suaves, mantendo colisão padrão. */
function drawCloudPlatform(ctx, platform, cameraX, cameraY, worldIndex) {
  const x = platform.x - cameraX;
  const y = platform.y - cameraY;
  const colors = ['#F4FFF2', '#E1FAFF', '#FFF4D6', '#FFE8D8'];
  const color = colors[worldIndex] || colors[0];
  const width = platform.width;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(105, 151, 174, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 14);
  ctx.bezierCurveTo(x + 2, y + 4, x + 10, y + 4, x + 15, y + 10);
  ctx.bezierCurveTo(x + 20, y - 1, x + 34, y - 2, x + 40, y + 9);
  ctx.bezierCurveTo(x + 48, y + 1, x + 61, y + 4, x + 65, y + 12);
  ctx.lineTo(x + width - 8, y + 12);
  ctx.bezierCurveTo(x + width + 3, y + 12, x + width + 2, y + 24, x + width - 10, y + 24);
  ctx.lineTo(x + 10, y + 24);
  ctx.bezierCurveTo(x - 3, y + 24, x - 5, y + 15, x, y + 14);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** Cada mundo ensina discretamente sua ação secreta quando o jogador se aproxima. */
function drawSecretHint(ctx, area, player, cameraX, cameraY, accessPlatform, revealed) {
  const access = area?.access;
  if (!access || revealed) return;
  const target = access.trigger || (accessPlatform && {
    x: accessPlatform.x - 45,
    y: accessPlatform.y - 100,
    width: accessPlatform.width + 90,
    height: 110,
  });
  if (!target) return;
  const dx = Math.abs(player.x + player.width / 2 - (target.x + target.width / 2));
  const dy = Math.abs(player.y + player.height / 2 - (target.y + target.height / 2));
  if (dx > 240 || dy > 180) return;

  const x = target.x + target.width / 2 - cameraX;
  const y = target.y - 18 - cameraY;
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  const width = Math.min(290, ctx.measureText(access.hint).width + 20);
  ctx.fillStyle = 'rgba(10, 18, 28, 0.82)';
  ctx.beginPath(); ctx.roundRect(x - width / 2, y - 15, width, 24, 7); ctx.fill();
  ctx.fillStyle = '#FFF3B0';
  ctx.fillText(access.hint, x, y + 1, width - 12);
  ctx.restore();
}

export default function GameCanvas({
  worldIndex,
  levelProgress,
  onNPCInteract,
  onPlayerHit,
  onMoneyBagCollect,
  collectedMoneyBags = [],
  isPaused,
  equippedSkin,
  doubleJumpEnabled = false,
  initialPosition = null,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(0);
  const keysRef = useRef({});
  const spawnX = typeof initialPosition?.x === 'number' ? initialPosition.x : 80;
  const spawnY = typeof initialPosition?.y === 'number' ? initialPosition.y : 440;
  const playerRef = useRef(createPlayer(spawnX, spawnY));
  const platforms = useMemo(() => createWorldPlatforms(worldIndex), [worldIndex]);
  const levelWidth = useMemo(
    () => Math.max(...platforms.map((platform) => platform.x + platform.width)) + 100,
    [platforms],
  );
  const hazards = useMemo(() => createWorldHazards(worldIndex, platforms), [worldIndex, platforms]);
  const moneyBags = useMemo(
    () => createWorldMoneyBags(worldIndex, collectedMoneyBags),
    [worldIndex, collectedMoneyBags],
  );
  const characters = useMemo(
    () => createWorldCharacters(platforms, worldIndex, levelProgress),
    [platforms, worldIndex, levelProgress],
  );
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
  const touchRef = useRef({ left: false, right: false, jump: false });
  const interactCooldownRef = useRef(45);
  const hazardCooldownRef = useRef(30);
  const jumpLatchRef = useRef(false);
  const secretRevealedRef = useRef(false);
  const secretRevealProgressRef = useRef(0);

  // Redimensionar canvas
  useEffect(() => {
    function resize() {
      const availableWidth = containerRef.current?.clientWidth || window.innerWidth;
      const mobileHeightRatio = window.innerWidth <= 768 ? 0.62 : 0.7;
      const w = Math.max(1, Math.floor(Math.min(availableWidth - 6, 1200)));
      const h = Math.max(180, Math.floor(Math.min(window.innerHeight * mobileHeightRatio, 540)));
      setCanvasSize({ width: w, height: h });
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', resize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
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

  // Reiniciar posição do jogador ao trocar de mundo ou atualizar checkpoint
  useEffect(() => {
    playerRef.current = createPlayer(spawnX, spawnY);
    secretRevealedRef.current = false;
    secretRevealProgressRef.current = 0;
  }, [worldIndex, spawnX, spawnY]);

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
      const previousStandingPlatform = player.standingPlatform;

      // 1. Atualizar plataformas móveis e elevadores
      updateWorldPlatforms(platforms, performance.now());
      alignCharactersToPlatforms(characters, platforms);

      // 2. Input
      const moveLeft = keys['a'] || keys['arrowleft'] || touch.left;
      const moveRight = keys['d'] || keys['arrowright'] || touch.right;
      const jump = keys[' '] || keys['w'] || keys['arrowup'] || touch.jump;
      const jumpPressed = jump && !jumpLatchRef.current;
      jumpLatchRef.current = jump;

      player.isWalking = false;
      if (moveLeft) { player.vx = -player.speed; player.facingRight = false; player.isWalking = true; }
      if (moveRight) { player.vx = player.speed; player.facingRight = true; player.isWalking = true; }

      // 3. Mecânica do jogador em cima de plataforma ou elevador
      if (player.standingPlatform) {
        const sp = player.standingPlatform;
        if (jumpPressed) {
          player.vy = player.jumpForce;
          player.isGrounded = false;
          player.jumpCount = 1;
          player.standingPlatform = null;
        } else {
          // Conduz o jogador suavemente junto com a plataforma ou elevador
          player.x += sp.vx;
          player.y = sp.y - player.height;
          player.vy = 0;
          player.isGrounded = true;

          // Se o jogador caminhou para fora da plataforma
          if (player.x + player.width < sp.x - 3 || player.x > sp.x + sp.width + 3) {
            player.standingPlatform = null;
          }
        }
      } else if (jumpPressed && (player.isGrounded || (doubleJumpEnabled && player.jumpCount === 1))) {
        const jumpingFromGround = player.isGrounded;
        player.vy = player.jumpForce;
        player.isGrounded = false;
        player.jumpCount = jumpingFromGround ? 1 : 2;
      }
      if (touch.jump) touch.jump = false; // Single tap jump

      // 4. Aplicação de gravidade e movimento
      if (!player.standingPlatform) {
        applyGravity(player);
      } else {
        // Aplica velocidade horizontal do jogador enquanto montado
        player.x += player.vx;
        player.vx *= 0.8;
        if (Math.abs(player.vx) < 0.1) player.vx = 0;
      }
      updatePlayerAnimation(player);

      const secretArea = WORLD_SECRET_AREAS[worldIndex];
      const access = secretArea?.access;
      let unlockedSecret = false;
      if (access?.method === 'down-switch') {
        // MUNDO 4: pressione ↓ parado sobre o selo marcado no basalto.
        unlockedSecret = Boolean(
          player.standingPlatform
          && checkCollision(player, access.trigger)
          && (keys.arrowdown || keys.s),
        );
      } else if (access?.method === 'apex-lift-jump') {
        // MUNDO 1: o salto só vale se partir do elevador no ponto mais alto.
        const lift = platforms.find((platform) => platform.id === access.platformId);
        unlockedSecret = Boolean(
          lift
          && previousStandingPlatform === lift
          && jumpPressed
          && lift.y <= access.maxPlatformY,
        );
      } else if (access?.method === 'faith-fall') {
        // MUNDO 2: caia em velocidade pelo vão; a nuvem surge sob o jogador.
        unlockedSecret = Boolean(
          player.vy >= access.minFallSpeed
          && checkCollision(player, access.trigger),
        );
      } else if (access?.method === 'spike-leap') {
        // MUNDO 3: atravesse a linha de espinhos por cima e alcance o outro lado.
        unlockedSecret = Boolean(
          player.jumpCount > 0
          && player.vy > 0
          && checkCollision(player, access.trigger),
        );
      }
      if (unlockedSecret) secretRevealedRef.current = true;
      if (secretRevealedRef.current) {
        // Fade suave. A colisão ativa junto do início para evitar que o jogador
        // caia através da rota enquanto as nuvens terminam de aparecer.
        secretRevealProgressRef.current = Math.min(1, secretRevealProgressRef.current + 0.03);
      }

      // 5. Colisão com plataformas
      let onAnyPlat = false;
      for (const plat of platforms) {
        if (plat.secret && !secretRevealedRef.current) continue;
        if (isOnPlatform(player, plat)) {
          player.standingPlatform = plat;
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.jumpCount = 0;
          onAnyPlat = true;
          break;
        }
      }
      if (!onAnyPlat && !player.standingPlatform) {
        player.isGrounded = false;
      }

      // 6. Espinhos funcionais: perdem uma vida e reposicionam o jogador no checkpoint/spawn
      if (hazardCooldownRef.current > 0) hazardCooldownRef.current--;
      if (hazardCooldownRef.current <= 0 && hazards.some((hazard) => checkCollision(player, hazard))) {
        hazardCooldownRef.current = 45;
        player.standingPlatform = null;
        player.x = spawnX;
        player.y = spawnY;
        player.vx = 0;
        player.vy = 0;
        player.jumpCount = 0;
        onPlayerHit?.();
      }

      // 7. Limites do nível
      clampToLevel(player, levelWidth, LEVEL_HEIGHT);
      if (player.y > LEVEL_HEIGHT - 50) {
        player.standingPlatform = null;
        player.x = spawnX;
        player.y = spawnY;
        player.vy = 0;
        player.jumpCount = 0;
      }

      // 8. Coleta de sacos: marca imediatamente no motor e credita uma única vez.
      for (const bag of moneyBags) {
        if (bag.secret && secretRevealProgressRef.current < 1) continue;
        if (!bag.collected && checkCollision(player, {
          x: bag.x + bag.floatX,
          y: bag.y + bag.floatY,
          width: bag.width,
          height: bag.height,
        })) {
          bag.collected = true;
          onMoneyBagCollect?.(bag.id, bag.value);
        }
      }

      // Camera
      const cameraX = Math.max(0, Math.min(player.x - canvasSize.width / 2 + player.width / 2, levelWidth - canvasSize.width));
      const cameraY = Math.max(0, Math.min(player.y - canvasSize.height / 2, LEVEL_HEIGHT - canvasSize.height));

      // Interação com portais/NPCs (cooldown)
      if (interactCooldownRef.current > 0) interactCooldownRef.current--;
      const interact = keys['e'] || keys['enter'];
      if (interact && interactCooldownRef.current <= 0) {
        for (const p of characters) {
          if (!p.activated && isNearCharacter(player, p)) {
            interactCooldownRef.current = 30;
            if (!p.locked) p.activated = true;
            onNPCInteract?.(p, { x: player.x, y: player.y });
            break;
          }
        }
      }

      // === Renderização ===
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      drawBackground(ctx, canvasSize.width, canvasSize.height, cameraX, frame, worldIndex);
      drawWorldScenery(ctx, cameraX, cameraY, platforms, worldIndex);

      // A ilusão é uma textura sem colisão; cruzar o vão não prende o jogador.
      // A parede some e a névoa ilumina o interior em sincronia com o fade.
      if (secretArea) {
        drawSecretEntrance(
          ctx,
          secretArea,
          worldIndex,
          cameraX,
          cameraY,
          secretRevealProgressRef.current,
        );
        drawSecretDecorations(ctx, secretArea, worldIndex, cameraX, cameraY, secretRevealProgressRef.current, frame);
        const accessPlatform = secretArea.accessPlatform
          ? platforms.find((platform) => platform.id === secretArea.accessPlatform.id)
          : null;
        drawSecretHint(ctx, secretArea, player, cameraX, cameraY, accessPlatform, secretRevealedRef.current);
      }

      // Casa de nascimento no início e castelo de conclusão no fim.
      drawHouse(ctx, 110, 520, cameraX, cameraY, worldIndex);
      drawCastle(ctx, levelWidth - 300, 520, cameraX, cameraY, frame, worldIndex);

      // Plataformas
      for (const plat of platforms) {
        if (plat.secret && !secretRevealedRef.current) continue;
        if (plat.secret) ctx.save();
        if (plat.secret) ctx.globalAlpha *= secretRevealProgressRef.current;
        if (plat.cloud) drawCloudPlatform(ctx, plat, cameraX, cameraY, worldIndex);
        else drawPlatform(ctx, plat, cameraX, cameraY, worldIndex);
        if (plat.secret) ctx.restore();
      }

      // Perigos
      for (const hazard of hazards) drawHazard(ctx, hazard, cameraX, cameraY, worldIndex);

      // Coletáveis aparecem à frente do cenário e acompanham a câmera.
      for (const bag of moneyBags) {
        if (bag.secret && secretRevealProgressRef.current < 1) continue;
        bag.draw(ctx, cameraX, cameraY, performance.now());
      }

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
  }, [isPaused, platforms, hazards, characters, moneyBags, canvasSize, levelWidth, onNPCInteract, onPlayerHit, onMoneyBagCollect, equippedSkin, doubleJumpEnabled, worldIndex, spawnX, spawnY]);

  return (
    <div ref={containerRef} className="game-canvas-root">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="game-canvas"
      />
      {/* Controles mobile */}
      <div className="mobile-controls" aria-label="Controles do jogo">
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
