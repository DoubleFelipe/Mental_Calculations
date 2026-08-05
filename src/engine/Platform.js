/**
 * Mental Calculations — Platforms & Portals
 * Plataformas com visual de terra/grama e portais interativos
 */

/** Cria definições de plataformas para o mapa de um mundo. */
export function createWorldPlatforms(worldIndex = 0) {
  // Mundo das Equações: uma única fase panorâmica com cinco áreas conectadas.
  const equationsWorld = [
    { x: 0, y: 520, width: 340, height: 34, area: 1 },
    { x: 390, y: 470, width: 190, height: 30, area: 1 },
    { x: 625, y: 430, width: 165, height: 30, area: 1 },
    { x: 830, y: 500, width: 145, height: 30, area: 2 },
    { x: 1010, y: 440, width: 145, height: 30, area: 2 },
    { x: 1190, y: 380, width: 145, height: 30, area: 2, elevated: true },
    { x: 1370, y: 475, width: 155, height: 30, area: 3 },
    { x: 1550, y: 415, width: 125, height: 30, area: 3, narrow: true },
    { x: 1705, y: 350, width: 115, height: 30, area: 3, narrow: true },
    { x: 1860, y: 425, width: 130, height: 30, area: 3, narrow: true },
    { x: 2010, y: 375, width: 138, height: 30, area: 4, suspended: true },
    { x: 2180, y: 405, width: 116, height: 30, area: 4, moving: true, baseX: 2180, range: 80 },
    { x: 2315, y: 300, width: 155, height: 30, area: 4, suspended: true },
    { x: 2455, y: 445, width: 125, height: 30, area: 4, moving: true, baseX: 2455, range: 70 },
    { x: 2600, y: 385, width: 150, height: 30, area: 5 },
    { x: 2780, y: 470, width: 165, height: 30, area: 5 },
    { x: 2960, y: 520, width: 260, height: 34, area: 5 },
    // Rotas alternativas nas áreas intermediária e avançada.
    { x: 1520, y: 285, width: 145, height: 24, area: 3, alternate: true },
    { x: 1725, y: 225, width: 135, height: 24, area: 3, alternate: true },
    { x: 1935, y: 185, width: 125, height: 24, area: 4, alternate: true, suspended: true },
    { x: 2150, y: 170, width: 115, height: 24, area: 4, alternate: true, suspended: true },
  ];

  if (worldIndex === 0) return equationsWorld;

  const layouts = [
    [
      { x: 0, y: 400, width: 300, height: 30 },
      { x: 330, y: 350, width: 220, height: 30 },
      { x: 590, y: 300, width: 220, height: 30 },
      { x: 850, y: 360, width: 220, height: 30 },
      { x: 1110, y: 320, width: 220, height: 30 },
      { x: 1370, y: 400, width: 230, height: 30 },
    ],
    [
      { x: 0, y: 420, width: 260, height: 30 },
      { x: 290, y: 370, width: 200, height: 30 },
      { x: 520, y: 320, width: 200, height: 30 },
      { x: 750, y: 270, width: 200, height: 30 },
      { x: 980, y: 340, width: 220, height: 30 },
      { x: 1230, y: 390, width: 370, height: 30 },
    ],
    [
      { x: 0, y: 400, width: 240, height: 30 },
      { x: 300, y: 360, width: 180, height: 30 },
      { x: 540, y: 330, width: 180, height: 30 },
      { x: 780, y: 370, width: 180, height: 30 },
      { x: 1020, y: 310, width: 180, height: 30 },
      { x: 1260, y: 400, width: 340, height: 30 },
    ],
    [
      { x: 0, y: 420, width: 320, height: 30 },
      { x: 360, y: 340, width: 190, height: 30 },
      { x: 590, y: 280, width: 190, height: 30 },
      { x: 820, y: 350, width: 190, height: 30 },
      { x: 1050, y: 290, width: 190, height: 30 },
      { x: 1280, y: 400, width: 320, height: 30 },
    ],
  ];

  return layouts[worldIndex % layouts.length];
}

/** Cria os cinco personagens que representam as fases do mundo. */
export function createWorldCharacters(platforms, worldIndex = 0, levelProgress = []) {
  // Uma definição por fase evita que a ordem visual dos NPCs troque o desafio iniciado.
  const worldNpcDefinitions = [
    { phase: 1, platformIndex: 1, areaName: 'Introdução', message: 'Bem-vindo! Sua jornada começa aqui.' },
    { phase: 2, platformIndex: 5, areaName: 'Primeiros desafios', message: 'Os desafios começaram!' },
    { phase: 3, platformIndex: 8, areaName: 'Dificuldade intermediária', message: 'Está ficando mais difícil!' },
    { phase: 4, platformIndex: 20, areaName: 'Desafio avançado', message: 'Só os melhores chegam até aqui!' },
    { phase: 5, platformIndex: 16, areaName: 'Final', message: 'Parabéns! Me vença para concluir este mundo!' },
  ];
  const definitions = worldIndex === 0
    ? worldNpcDefinitions
    : worldNpcDefinitions.map((definition, index) => ({ ...definition, platformIndex: index }));

  return definitions.map((definition) => {
    const levelIndex = definition.phase - 1;
    const platformIndex = definition.platformIndex;
    const platform = platforms[platformIndex] || platforms[platforms.length - 1];
    const progress = levelProgress[levelIndex] || {};
    return {
      x: platform.x + platform.width / 2 - 15,
      y: platform.y - 55,
      width: 30,
      height: 50,
      type: 'npc',
      levelIndex,
      phaseName: `Fase ${definition.phase}`,
      levelName: progress.levelName || `Fase ${levelIndex + 1}`,
      areaName: definition.areaName,
      message: definition.message,
      stars: progress.stars || 0,
      locked: progress.unlocked === false,
      color: ['#4CAF50', '#42A5F5', '#FFD54F', '#EF5350'][worldIndex % 4],
      activated: false,
    };
  });
}

/** Obstáculos do percurso do Mundo das Equações. */
export function createWorldHazards(worldIndex = 0) {
  if (worldIndex !== 0) return [];
  return [
    // Cada grupo fica centralizado na plataforma estática correspondente.
    { x: 684, y: 412, width: 48, height: 18, type: 'spikes', area: 2 },
    { x: 882, y: 482, width: 42, height: 18, type: 'spikes', area: 2 },
    { x: 1059, y: 422, width: 48, height: 18, type: 'spikes', area: 2 },
    { x: 1421, y: 457, width: 54, height: 18, type: 'spikes', area: 3 },
    { x: 1585, y: 397, width: 42, height: 18, type: 'spikes', area: 3 },
    { x: 2049, y: 357, width: 60, height: 18, type: 'spikes', area: 4 },
    { x: 2842, y: 452, width: 42, height: 18, type: 'spikes', area: 5 },
  ];
}

/** Cria definições de plataformas para uma fase legada. */
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
  const animatedX = plat.moving
    ? plat.baseX + Math.sin((performance.now() / 900) + plat.baseX) * plat.range
    : plat.x;
  const x = animatedX - cameraX;
  const y = plat.y - cameraY;

  if (plat.suspended) {
    ctx.save();
    ctx.strokeStyle = '#6D4C41';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 42);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x + plat.width - 18, y - 42);
    ctx.lineTo(x + plat.width - 18, y);
    ctx.stroke();
    for (let chainY = y - 38; chainY < y - 4; chainY += 9) {
      ctx.fillStyle = '#A1887F';
      ctx.fillRect(x + 14, chainY, 8, 4);
      ctx.fillRect(x + plat.width - 22, chainY, 8, 4);
    }
    ctx.restore();
  }

  if (plat.moving) {
    ctx.save();
    ctx.fillStyle = 'rgba(84, 110, 122, 0.7)';
    ctx.fillRect(x + plat.width / 2 - 2, y - 30, 4, 30);
    ctx.fillStyle = '#607D8B';
    ctx.beginPath();
    ctx.arc(x + plat.width / 2, y - 32, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

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

  if (plat.narrow || plat.alternate) {
    ctx.fillStyle = plat.alternate ? '#81C784' : '#66BB6A';
    ctx.fillRect(x + 8, y - 2, Math.max(10, plat.width - 16), 3);
  }
}

/** Desenha espinhos vermelhos com silhueta legível. */
export function drawHazard(ctx, hazard, cameraX, cameraY) {
  const x = hazard.x - cameraX;
  const y = hazard.y - cameraY;
  const spikes = Math.max(1, Math.floor(hazard.width / 14));
  ctx.save();
  ctx.fillStyle = '#E53935';
  ctx.strokeStyle = '#8E2020';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < spikes; i += 1) {
    const left = x + i * (hazard.width / spikes);
    const right = x + (i + 1) * (hazard.width / spikes);
    const mid = (left + right) / 2;
    ctx.moveTo(left, y + hazard.height);
    ctx.lineTo(mid, y);
    ctx.lineTo(right, y + hazard.height);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Cria portais/NPCs para uma fase legada. */
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
export function drawNPCLegacy(ctx, npc, cameraX, cameraY, frame) {
  const x = npc.x - cameraX + npc.width / 2;
  const y = npc.y - cameraY;

  ctx.save();
  ctx.strokeStyle = npc.color || '#555';
  ctx.fillStyle = npc.locked ? 'rgba(70,70,70,0.75)' : 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Cabeça com triângulo (como na inspiração)
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 8, y + 14);
  ctx.lineTo(x + 8, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Olhos
  ctx.fillStyle = npc.color || '#555';
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

  // Identificação do personagem e estrelas conquistadas
  if (!npc.activated) {
    const bobY = Math.sin(frame * 0.05) * 3;
    ctx.fillStyle = npc.locked ? 'rgba(35,35,35,0.88)' : 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.roundRect(x - 70, y - 48 + bobY, 140, 38, 8);
    ctx.fill();
    // Pontinha do balão
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 10 + bobY);
    ctx.lineTo(x, y - 5 + bobY);
    ctx.lineTo(x + 5, y - 10 + bobY);
    ctx.fill();

    ctx.fillStyle = npc.locked ? '#FFD54F' : '#333';
    ctx.font = '11px Patrick Hand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.locked ? 'BLOQUEADO' : `Fase ${npc.levelIndex + 1}`, x, y - 30 + bobY);
    ctx.font = '12px Patrick Hand, sans-serif';
    ctx.fillText('★'.repeat(npc.stars) + '☆'.repeat(3 - npc.stars), x, y - 16 + bobY);
  }

  ctx.restore();
}

/** NPCs do mapa atual, com cabeça triangular e balão de diálogo da área. */
export function drawNPC(ctx, npc, cameraX, cameraY, frame) {
  const x = npc.x - cameraX + npc.width / 2;
  const y = npc.y - cameraY;
  const bobY = Math.sin(frame * 0.05) * 3;
  const message = npc.message || 'Prepare-se!';
  const bubbleWidth = Math.min(250, Math.max(170, message.length * 5.2));
  const bubbleHeight = message.length > 34 ? 58 : 44;

  ctx.save();
  ctx.strokeStyle = npc.color || '#555';
  ctx.fillStyle = npc.locked ? 'rgba(70,70,70,0.8)' : '#FFFDF2';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Cabeça triangular.
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 9, y + 15);
  ctx.lineTo(x + 9, y + 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = npc.color || '#455A64';
  ctx.beginPath();
  ctx.arc(x - 2.5, y + 8, 1.7, 0, Math.PI * 2);
  ctx.arc(x + 2.5, y + 8, 1.7, 0, Math.PI * 2);
  ctx.fill();

  // Corpo simples e expressivo.
  ctx.beginPath();
  ctx.moveTo(x, y + 15); ctx.lineTo(x, y + 34);
  ctx.moveTo(x, y + 22); ctx.lineTo(x - 11, y + 28);
  ctx.moveTo(x, y + 22); ctx.lineTo(x + 11, y + 28);
  ctx.moveTo(x, y + 34); ctx.lineTo(x - 7, y + 48);
  ctx.moveTo(x, y + 34); ctx.lineTo(x + 7, y + 48);
  ctx.stroke();

  // Balão sempre visível no mapa, com quebra de linha para manter a leitura.
  ctx.fillStyle = npc.locked ? 'rgba(35,35,35,0.9)' : 'rgba(255,253,242,0.96)';
  ctx.beginPath();
  ctx.roundRect(x - bubbleWidth / 2, y - 58 + bobY, bubbleWidth, bubbleHeight, 10);
  ctx.fill();
  ctx.strokeStyle = npc.color || '#78909C';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 10 + bobY);
  ctx.lineTo(x, y - 3 + bobY);
  ctx.lineTo(x + 7, y - 10 + bobY);
  ctx.fill();

  ctx.fillStyle = npc.locked ? '#FFD54F' : '#2D3A2E';
  ctx.textAlign = 'center';
  ctx.font = 'bold 10px Patrick Hand, sans-serif';
  ctx.fillText(npc.phaseName || `Fase ${npc.levelIndex + 1}`, x, y - 42 + bobY);
  ctx.font = '11px Patrick Hand, sans-serif';
  const words = message.split(' ');
  let line = '';
  const lines = [];
  words.forEach((word) => {
    const next = `${line} ${word}`.trim();
    if (ctx.measureText(next).width > bubbleWidth - 18) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((text, index) => ctx.fillText(text, x, y - 25 + index * 13 + bobY));
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
