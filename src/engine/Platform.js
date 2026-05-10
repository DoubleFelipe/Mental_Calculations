/**
 * Mental Calculations — Platforms & Portals
 * Plataformas com visual de terra/grama e portais interativos
 */

/** Cria definições de plataformas para uma fase */
export function createLevelPlatforms(levelIndex) {
  const layouts = [
    // Layout 0 - Introdutório
    [
      { x: 0, y: 400, width: 300, height: 30 },
      { x: 350, y: 370, width: 200, height: 30 },
      { x: 600, y: 340, width: 250, height: 30 },
      { x: 900, y: 370, width: 200, height: 30 },
      { x: 1150, y: 400, width: 300, height: 30 },
    ],
    // Layout 1 - Escadaria
    [
      { x: 0, y: 420, width: 250, height: 30 },
      { x: 280, y: 370, width: 180, height: 30 },
      { x: 500, y: 320, width: 180, height: 30 },
      { x: 720, y: 270, width: 180, height: 30 },
      { x: 940, y: 320, width: 200, height: 30 },
      { x: 1180, y: 370, width: 250, height: 30 },
    ],
    // Layout 2 - Gaps
    [
      { x: 0, y: 400, width: 200, height: 30 },
      { x: 300, y: 380, width: 150, height: 30 },
      { x: 550, y: 350, width: 150, height: 30 },
      { x: 800, y: 380, width: 150, height: 30 },
      { x: 1050, y: 350, width: 150, height: 30 },
      { x: 1300, y: 400, width: 200, height: 30 },
    ],
    // Layout 3 - Multi-level
    [
      { x: 0, y: 420, width: 400, height: 30 },
      { x: 200, y: 320, width: 150, height: 30 },
      { x: 450, y: 280, width: 200, height: 30 },
      { x: 700, y: 350, width: 250, height: 30 },
      { x: 1000, y: 300, width: 200, height: 30 },
      { x: 1250, y: 400, width: 300, height: 30 },
    ],
    // Layout 4 - Desafio
    [
      { x: 0, y: 400, width: 180, height: 30 },
      { x: 250, y: 350, width: 120, height: 30 },
      { x: 440, y: 300, width: 120, height: 30 },
      { x: 630, y: 250, width: 120, height: 30 },
      { x: 820, y: 300, width: 120, height: 30 },
      { x: 1010, y: 350, width: 120, height: 30 },
      { x: 1200, y: 300, width: 150, height: 30 },
      { x: 1400, y: 400, width: 200, height: 30 },
    ],
  ];
  return layouts[levelIndex % layouts.length];
}

/** Desenha uma plataforma com visual de terra + grama */
export function drawPlatform(ctx, plat, cameraX, cameraY) {
  const x = plat.x - cameraX;
  const y = plat.y - cameraY;

  // Terra
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(x, y + 6, plat.width, plat.height - 6);

  // Grama
  const grassGrad = ctx.createLinearGradient(x, y, x, y + 10);
  grassGrad.addColorStop(0, '#4CAF50');
  grassGrad.addColorStop(1, '#388E3C');
  ctx.fillStyle = grassGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, plat.width, 10, [4, 4, 0, 0]);
  ctx.fill();

  // Textura de terra
  ctx.fillStyle = '#7A5B1A';
  for (let i = 0; i < plat.width; i += 20) {
    ctx.fillRect(x + i + 5, y + 15, 8, 3);
  }
}

/** Cria portais/NPCs para uma fase */
export function createPortals(platforms) {
  // Coloca um portal na última plataforma e NPCs em plataformas do meio
  const portals = [];
  if (platforms.length >= 3) {
    const midPlat = platforms[Math.floor(platforms.length / 2)];
    portals.push({
      x: midPlat.x + midPlat.width / 2 - 15,
      y: midPlat.y - 55,
      width: 30, height: 50,
      type: 'npc',
      message: 'Resolva o desafio!',
      activated: false,
    });
  }
  // Portal final
  const lastPlat = platforms[platforms.length - 1];
  portals.push({
    x: lastPlat.x + lastPlat.width / 2 - 20,
    y: lastPlat.y - 60,
    width: 40, height: 55,
    type: 'portal',
    activated: false,
  });
  return portals;
}

/** Desenha um NPC (stick figure com triângulo na cabeça) */
export function drawNPC(ctx, npc, cameraX, cameraY, frame) {
  const x = npc.x - cameraX + npc.width / 2;
  const y = npc.y - cameraY;

  ctx.save();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Cabeça com triângulo (como na inspiração)
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 8, y + 14);
  ctx.lineTo(x + 8, y + 14);
  ctx.closePath();
  ctx.stroke();

  // Olhos
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(x - 2, y + 8, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 2, y + 8, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Corpo
  ctx.beginPath();
  ctx.moveTo(x, y + 14);
  ctx.lineTo(x, y + 32);
  ctx.stroke();

  // Braços
  ctx.beginPath();
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x - 10, y + 28);
  ctx.moveTo(x, y + 22);
  ctx.lineTo(x + 10, y + 28);
  ctx.stroke();

  // Pernas
  ctx.beginPath();
  ctx.moveTo(x, y + 32);
  ctx.lineTo(x - 7, y + 45);
  ctx.moveTo(x, y + 32);
  ctx.lineTo(x + 7, y + 45);
  ctx.stroke();

  // Balão de fala
  if (!npc.activated) {
    const bobY = Math.sin(frame * 0.05) * 3;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(x - 50, y - 35 + bobY, 100, 25, 8);
    ctx.fill();
    // Pontinha do balão
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 10 + bobY);
    ctx.lineTo(x, y - 5 + bobY);
    ctx.lineTo(x + 5, y - 10 + bobY);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = '11px Patrick Hand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.message, x, y - 18 + bobY);
  }

  ctx.restore();
}

/** Desenha um portal brilhante */
export function drawPortal(ctx, portal, cameraX, cameraY, frame) {
  const x = portal.x - cameraX;
  const y = portal.y - cameraY;
  const cx = x + portal.width / 2;
  const cy = y + portal.height / 2;

  ctx.save();

  // Brilho pulsante
  const glowSize = 20 + Math.sin(frame * 0.08) * 8;
  const glow = ctx.createRadialGradient(cx, cy, 5, cx, cy, glowSize);
  glow.addColorStop(0, 'rgba(66,165,245,0.6)');
  glow.addColorStop(0.5, 'rgba(66,165,245,0.2)');
  glow.addColorStop(1, 'rgba(66,165,245,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 20, y - 20, portal.width + 40, portal.height + 40);

  // Portal (arco)
  ctx.strokeStyle = '#42A5F5';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Espiral interna
  ctx.strokeStyle = 'rgba(144,202,249,0.6)';
  ctx.lineWidth = 2;
  const rot = frame * 0.03;
  for (let i = 0; i < 3; i++) {
    const angle = rot + (i * Math.PI * 2 / 3);
    ctx.beginPath();
    ctx.arc(cx, cy, 12, angle, angle + Math.PI * 0.8);
    ctx.stroke();
  }

  // Texto
  ctx.fillStyle = '#42A5F5';
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MISSÃO', cx, y + portal.height + 15);

  ctx.restore();
}
