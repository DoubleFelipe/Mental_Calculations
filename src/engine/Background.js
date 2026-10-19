/**
 * Mental Calculations — Background
 * Cenário com céu, nuvens, relevo em parallax e decorações temáticas por mundo
 */

export function drawBackground(ctx, width, height, cameraX, frame, worldIndex = 0) {
  if (worldIndex === 1) {
    // ================= MUNDO 1: COSTA OCEÂNICA =================
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#0097A7');
    skyGrad.addColorStop(0.5, '#4DD0E1');
    skyGrad.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    drawSeaClouds(ctx, width, height, cameraX * 0.1, frame);
    drawHills(ctx, width, height, cameraX * 0.25, '#00838F', 0.68, 90);
    drawHills(ctx, width, height, cameraX * 0.45, '#00695C', 0.82, 60);
    drawSeafoam(ctx, width, height, cameraX * 0.6);
  } else if (worldIndex === 2) {
    // ================= MUNDO 2: CANYON & TEMPLO DO DELTA =================
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#E65100');
    skyGrad.addColorStop(0.5, '#FFA726');
    skyGrad.addColorStop(1, '#FFF8E1');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    drawElectricSparks(ctx, width, height, cameraX, frame);
    drawDistantPyramids(ctx, width, height, cameraX * 0.2);
    drawHills(ctx, width, height, cameraX * 0.3, '#BF360C', 0.72, 110);
    drawHills(ctx, width, height, cameraX * 0.5, '#D84315', 0.84, 70);
    drawDesertBushes(ctx, width, height, cameraX * 0.6);
  } else if (worldIndex === 3) {
    // ================= MUNDO 3: FORTALEZA VULCÂNICA & MAGMA =================
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#1A1A24');
    skyGrad.addColorStop(0.4, '#4A148C');
    skyGrad.addColorStop(0.8, '#BF360C');
    skyGrad.addColorStop(1, '#FF5722');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    drawVolcanoSmoke(ctx, width, height, cameraX * 0.1, frame);
    drawRisingEmbers(ctx, width, height, frame);
    drawHills(ctx, width, height, cameraX * 0.25, '#3E2723', 0.7, 130);
    drawHills(ctx, width, height, cameraX * 0.5, '#212121', 0.85, 75);
  } else {
    // ================= MUNDO 0: FLORESTA & EQUAÇÕES =================
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(0.6, '#B0E2FF');
    skyGrad.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    drawClouds(ctx, width, height, cameraX * 0.1, frame);
    drawHills(ctx, width, height, cameraX * 0.3, '#4CAF50', 0.7, 120);
    drawHills(ctx, width, height, cameraX * 0.5, '#388E3C', 0.85, 80);
    drawBushes(ctx, width, height, cameraX * 0.6);
  }
}

function drawClouds(ctx, w, h, offsetX, frame) {
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  const clouds = [
    { x: 100, y: 50, s: 1.2 },
    { x: 400, y: 80, s: 0.8 },
    { x: 700, y: 40, s: 1.0 },
    { x: 1000, y: 70, s: 0.9 },
    { x: 1300, y: 55, s: 1.1 },
  ];
  clouds.forEach((c) => {
    const cx = ((c.x - offsetX + frame * 0.1) % (w + 200)) - 100;
    const cy = c.y;
    const s = c.s;
    ctx.beginPath();
    ctx.arc(cx, cy, 25 * s, 0, Math.PI * 2);
    ctx.arc(cx + 20 * s, cy - 5 * s, 20 * s, 0, Math.PI * 2);
    ctx.arc(cx + 40 * s, cy, 22 * s, 0, Math.PI * 2);
    ctx.arc(cx + 15 * s, cy + 5 * s, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSeaClouds(ctx, w, h, offsetX, frame) {
  ctx.fillStyle = 'rgba(224, 247, 250, 0.85)';
  const clouds = [
    { x: 80, y: 45, s: 1.3 },
    { x: 420, y: 70, s: 0.9 },
    { x: 760, y: 35, s: 1.1 },
    { x: 1100, y: 65, s: 0.8 },
  ];
  clouds.forEach((c) => {
    const cx = ((c.x - offsetX + frame * 0.14) % (w + 200)) - 100;
    ctx.beginPath();
    ctx.ellipse(cx, c.y, 45 * c.s, 16 * c.s, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 25 * c.s, c.y - 6 * c.s, 30 * c.s, 14 * c.s, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Gaivotas voando
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.8;
  const birds = [
    { x: 260, y: 90 },
    { x: 620, y: 60 },
    { x: 950, y: 110 },
  ];
  birds.forEach((b) => {
    const bx = ((b.x - offsetX * 1.2 + frame * 0.4) % (w + 160)) - 80;
    const flap = Math.sin(frame * 0.15) * 4;
    ctx.beginPath();
    ctx.moveTo(bx - 10, b.y + flap);
    ctx.quadraticCurveTo(bx - 5, b.y - 6 + flap, bx, b.y);
    ctx.quadraticCurveTo(bx + 5, b.y - 6 + flap, bx + 10, b.y + flap);
    ctx.stroke();
  });
}

function drawElectricSparks(ctx, w, h, cameraX, frame) {
  // Raios e relâmpagos sutis no horizonte
  if (frame % 120 < 10) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 140, 0.6)';
    ctx.lineWidth = 2;
    const rx = (800 - cameraX * 0.1) % w;
    ctx.beginPath();
    ctx.moveTo(rx, 30);
    ctx.lineTo(rx - 15, 70);
    ctx.lineTo(rx + 8, 100);
    ctx.lineTo(rx - 10, 150);
    ctx.stroke();
    ctx.restore();
  }
}

function drawDistantPyramids(ctx, w, h, offsetX) {
  ctx.save();
  ctx.fillStyle = '#E65100';
  const pyramids = [
    { x: 200, w: 180, h: 100 },
    { x: 650, w: 220, h: 120 },
    { x: 1100, w: 160, h: 90 },
  ];
  pyramids.forEach((p) => {
    const px = ((p.x - offsetX) % (w + 300)) - 150;
    const baseY = h * 0.74;
    ctx.beginPath();
    ctx.moveTo(px, baseY);
    ctx.lineTo(px + p.w / 2, baseY - p.h);
    ctx.lineTo(px + p.w, baseY);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();
}

function drawVolcanoSmoke(ctx, w, h, offsetX, frame) {
  ctx.save();
  ctx.fillStyle = 'rgba(50, 40, 40, 0.4)';
  for (let i = 0; i < 4; i++) {
    const sx = ((350 + i * 380 - offsetX) % (w + 200)) - 100;
    const sy = 120 - Math.sin((frame * 0.02) + i) * 20;
    ctx.beginPath();
    ctx.arc(sx, sy, 40 + i * 10, 0, Math.PI * 2);
    ctx.arc(sx + 30, sy - 20, 50 + i * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRisingEmbers(ctx, w, h, frame) {
  ctx.save();
  for (let i = 0; i < 16; i++) {
    const emberX = ((i * 85 + Math.sin(frame * 0.02 + i) * 30) % w);
    const emberY = (h - ((frame * 1.5 + i * 45) % h));
    const size = (i % 3) + 1.5;
    ctx.fillStyle = i % 2 === 0 ? '#FFD600' : '#FF3D00';
    ctx.beginPath();
    ctx.arc(emberX, emberY, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHills(ctx, w, h, offsetX, color, yPct, amplitude) {
  const baseY = h * yPct;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 5) {
    const y = baseY + Math.sin((x + offsetX) * 0.005) * amplitude
                    + Math.sin((x + offsetX) * 0.01) * (amplitude * 0.5);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

function drawBushes(ctx, w, h, offsetX) {
  ctx.fillStyle = '#2E7D32';
  const bushes = [50, 200, 380, 550, 750, 950, 1100, 1300];
  bushes.forEach((bx) => {
    const x = ((bx - offsetX) % (w + 100));
    const y = h * 0.82;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 3, 12, 0, Math.PI * 2);
    ctx.arc(x + 28, y, 14, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSeafoam(ctx, w, h, offsetX) {
  ctx.fillStyle = 'rgba(0, 172, 193, 0.4)';
  const foam = [60, 230, 420, 600, 790, 990, 1180];
  foam.forEach((fx) => {
    const x = ((fx - offsetX) % (w + 100));
    const y = h * 0.85;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.arc(x + 18, y - 4, 13, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawDesertBushes(ctx, w, h, offsetX) {
  ctx.fillStyle = '#BF360C';
  const bushes = [80, 260, 480, 690, 890, 1120];
  bushes.forEach((bx) => {
    const x = ((bx - offsetX) % (w + 100));
    const y = h * 0.84;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.arc(x + 12, y - 2, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Casa inicial decorativa com tematização por mundo */
export function drawHouse(ctx, x, y, cameraX, cameraY = 0, worldIndex = 0) {
  const hx = x - cameraX;
  const hy = y - cameraY;
  ctx.save();

  // Cores personalizadas por mundo
  const wallColor = worldIndex === 3 ? '#37474F' : worldIndex === 2 ? '#FFE082' : worldIndex === 1 ? '#E0F7FA' : '#FFB74D';
  const roofColor = worldIndex === 3 ? '#D50000' : worldIndex === 2 ? '#E65100' : worldIndex === 1 ? '#00ACC1' : '#EF5350';
  const doorColor = worldIndex === 3 ? '#212121' : worldIndex === 2 ? '#8D6E63' : worldIndex === 1 ? '#00838F' : '#8D6E63';

  // Corpo da casa
  ctx.fillStyle = wallColor;
  ctx.fillRect(hx, hy - 60, 70, 60);

  // Telhado
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(hx - 5, hy - 60);
  ctx.lineTo(hx + 35, hy - 95);
  ctx.lineTo(hx + 75, hy - 60);
  ctx.closePath();
  ctx.fill();

  // Janela
  ctx.fillStyle = worldIndex === 3 ? '#FF9E80' : worldIndex === 2 ? '#FFF59D' : '#42A5F5';
  ctx.fillRect(hx + 40, hy - 50, 20, 20);

  // Porta
  ctx.fillStyle = doorColor;
  ctx.fillRect(hx + 10, hy - 40, 18, 40);

  // Maçaneta
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.arc(hx + 24, hy - 20, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Castelo de conclusão estilizado por mundo */
export function drawCastle(ctx, x, y, cameraX, cameraY, frame = 0, worldIndex = 0) {
  const cx = x - cameraX;
  const cy = y - cameraY;
  ctx.save();

  const stoneColor = worldIndex === 3 ? '#263238' : worldIndex === 2 ? '#FFA000' : worldIndex === 1 ? '#00838F' : '#78909C';
  const strokeColor = worldIndex === 3 ? '#102027' : worldIndex === 2 ? '#BF360C' : worldIndex === 1 ? '#006064' : '#455A64';
  const roofColor = worldIndex === 3 ? '#D50000' : worldIndex === 2 ? '#FFD54F' : worldIndex === 1 ? '#00E5FF' : '#EF5350';
  const flagColor = worldIndex === 3 ? '#FF3D00' : worldIndex === 2 ? '#FFEA00' : worldIndex === 1 ? '#18FFFF' : '#FFCA28';

  ctx.fillStyle = stoneColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;
  ctx.fillRect(cx, cy - 150, 190, 150);
  ctx.fillRect(cx - 26, cy - 190, 58, 190);
  ctx.fillRect(cx + 158, cy - 190, 58, 190);
  ctx.strokeRect(cx, cy - 150, 190, 150);
  ctx.strokeRect(cx - 26, cy - 190, 58, 190);
  ctx.strokeRect(cx + 158, cy - 190, 58, 190);

  // Telhados das torres
  ctx.fillStyle = roofColor;
  ctx.beginPath(); ctx.moveTo(cx - 34, cy - 190); ctx.lineTo(cx + 3, cy - 235); ctx.lineTo(cx + 40, cy - 190); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 150, cy - 190); ctx.lineTo(cx + 187, cy - 235); ctx.lineTo(cx + 224, cy - 190); ctx.fill();

  // Portão
  ctx.fillStyle = '#212121';
  ctx.fillRect(cx + 74, cy - 84, 42, 84);
  ctx.beginPath(); ctx.arc(cx + 95, cy - 84, 21, Math.PI, 0); ctx.fill();

  // Janelas
  ctx.fillStyle = '#90CAF9';
  ctx.fillRect(cx + 12, cy - 133, 16, 22); ctx.fillRect(cx + 166, cy - 133, 16, 22);

  // Bandeiras animadas
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx + 3, cy - 235); ctx.lineTo(cx + 3, cy - 270); ctx.moveTo(cx + 187, cy - 235); ctx.lineTo(cx + 187, cy - 270); ctx.stroke();
  ctx.fillStyle = flagColor;
  const wave = Math.sin(frame * 0.05) * 3;
  ctx.beginPath(); ctx.moveTo(cx + 3, cy - 268); ctx.lineTo(cx + 34, cy - 260 + wave); ctx.lineTo(cx + 3, cy - 250); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 187, cy - 268); ctx.lineTo(cx + 218, cy - 260 - wave); ctx.lineTo(cx + 187, cy - 250); ctx.fill();

  ctx.fillStyle = '#FFF59D';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIM DO MUNDO', cx + 95, cy - 160);
  ctx.restore();
}

// =============================================================================
// CENÁRIO E DECORAÇÕES DE CADA MUNDO
// =============================================================================

export const WORLD_0_SCENERY = [
  { type: 'tree', platformIndex: 0, offset: 250, scale: 1.1 },
  { type: 'tree', platformIndex: 1, offset: 140, scale: 0.75 },
  { type: 'tree', platformIndex: 2, offset: 110, scale: 0.7 },
  { type: 'bush', platformIndex: 4, offset: 90, scale: 1 },
  { type: 'tree', platformIndex: 5, offset: 30, scale: 0.65 },
  { type: 'tree', platformIndex: 8, offset: 40, scale: 0.8 },
  { type: 'bush', platformIndex: 9, offset: 25, scale: 0.9 },
  { type: 'tree', platformIndex: 12, offset: 70, scale: 0.65 },
  { type: 'tree', platformIndex: 13, offset: 140, scale: 0.85 },
  { type: 'tree', platformIndex: 15, offset: 100, scale: 0.9 },
  { type: 'sign', platformIndex: 0, offset: 300, label: 'INÍCIO' },
  { type: 'sign', platformIndex: 2, offset: 25, label: 'ELEVADOR' },
  { type: 'sign', platformIndex: 8, offset: 30, label: 'VALE' },
  { type: 'sign', platformIndex: 15, offset: 30, label: 'FINAL' },
];

export const WORLD_1_SCENERY = [
  { type: 'palm', platformIndex: 0, offset: 240, scale: 1.1 },
  { type: 'coral', platformIndex: 1, offset: 130, scale: 0.8 },
  { type: 'palm', platformIndex: 2, offset: 100, scale: 0.75 },
  { type: 'coral', platformIndex: 4, offset: 80, scale: 1 },
  { type: 'palm', platformIndex: 6, offset: 30, scale: 0.7 },
  { type: 'coral', platformIndex: 7, offset: 40, scale: 0.85 },
  { type: 'palm', platformIndex: 11, offset: 40, scale: 0.85 },
  { type: 'coral', platformIndex: 15, offset: 130, scale: 0.8 },
  { type: 'palm', platformIndex: 16, offset: 90, scale: 0.9 },
  { type: 'sign', platformIndex: 0, offset: 290, label: 'PRAIA' },
  { type: 'sign', platformIndex: 2, offset: 25, label: 'GÊISER' },
  { type: 'sign', platformIndex: 11, offset: 25, label: 'RECIFE' },
  { type: 'sign', platformIndex: 16, offset: 30, label: 'ATLÂNTIDA' },
];

export const WORLD_2_SCENERY = [
  { type: 'cactus', platformIndex: 0, offset: 250, scale: 1.1 },
  { type: 'pylon', platformIndex: 1, offset: 130, scale: 0.85 },
  { type: 'cactus', platformIndex: 2, offset: 90, scale: 0.75 },
  { type: 'pylon', platformIndex: 4, offset: 30, scale: 0.7 },
  { type: 'cactus', platformIndex: 6, offset: 90, scale: 0.8 },
  { type: 'pylon', platformIndex: 8, offset: 35, scale: 0.9 },
  { type: 'cactus', platformIndex: 13, offset: 130, scale: 0.75 },
  { type: 'pylon', platformIndex: 14, offset: 80, scale: 0.85 },
  { type: 'cactus', platformIndex: 15, offset: 80, scale: 0.8 },
  { type: 'sign', platformIndex: 0, offset: 290, label: 'CANYON' },
  { type: 'sign', platformIndex: 2, offset: 25, label: 'ALTA TENSÃO' },
  { type: 'sign', platformIndex: 8, offset: 25, label: 'ABISMO' },
  { type: 'sign', platformIndex: 15, offset: 25, label: 'PIRÂMIDE' },
];

export const WORLD_3_SCENERY = [
  { type: 'brazier', platformIndex: 0, offset: 240, scale: 1 },
  { type: 'crystal', platformIndex: 1, offset: 130, scale: 0.85 },
  { type: 'brazier', platformIndex: 2, offset: 90, scale: 0.75 },
  { type: 'crystal', platformIndex: 4, offset: 110, scale: 0.9 },
  { type: 'brazier', platformIndex: 6, offset: 30, scale: 0.75 },
  { type: 'crystal', platformIndex: 7, offset: 80, scale: 0.8 },
  { type: 'brazier', platformIndex: 9, offset: 35, scale: 0.9 },
  { type: 'crystal', platformIndex: 13, offset: 130, scale: 0.8 },
  { type: 'brazier', platformIndex: 14, offset: 80, scale: 0.75 },
  { type: 'sign', platformIndex: 0, offset: 290, label: 'FORJA' },
  { type: 'sign', platformIndex: 2, offset: 25, label: 'MAGMA' },
  { type: 'sign', platformIndex: 9, offset: 25, label: 'NÚCLEO' },
  { type: 'sign', platformIndex: 14, offset: 25, label: 'MESTRES' },
];

export const WORLD_SCENERY_MAP = {
  0: WORLD_0_SCENERY,
  1: WORLD_1_SCENERY,
  2: WORLD_2_SCENERY,
  3: WORLD_3_SCENERY,
};

/** Decorações ancoradas diretamente nas plataformas do mapa */
export function drawWorldScenery(ctx, cameraX, cameraY, platforms = [], worldIndex = 0) {
  const scenery = WORLD_SCENERY_MAP[worldIndex] || WORLD_0_SCENERY;

  scenery.forEach((item) => {
    const platform = platforms[item.platformIndex];
    if (!platform) return;
    const x = platform.x + item.offset - cameraX;
    const y = platform.y - cameraY;
    if (x < -180 || x > ctx.canvas.width + 180) return;

    if (item.type === 'tree') drawTree(ctx, x, y, item.scale);
    else if (item.type === 'bush') drawBushDetail(ctx, x, y, item.scale);
    else if (item.type === 'palm') drawPalmTree(ctx, x, y, item.scale);
    else if (item.type === 'coral') drawCoralDetail(ctx, x, y, item.scale);
    else if (item.type === 'cactus') drawCactus(ctx, x, y, item.scale);
    else if (item.type === 'pylon') drawElectricPylon(ctx, x, y, item.scale);
    else if (item.type === 'brazier') drawFireBrazier(ctx, x, y, item.scale);
    else if (item.type === 'crystal') drawMagmaCrystal(ctx, x, y, item.scale);
    else if (item.type === 'sign') drawSignpost(ctx, x, y, item.label, worldIndex);
  });
}

function drawTree(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#795548';
  ctx.fillRect(-8, -68, 16, 68);
  ctx.fillStyle = '#2E7D32';
  ctx.beginPath(); ctx.arc(-25, -74, 25, 0, Math.PI * 2); ctx.arc(5, -83, 30, 0, Math.PI * 2); ctx.arc(28, -68, 23, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath(); ctx.arc(-6, -98, 14, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawBushDetail(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#388E3C';
  ctx.beginPath(); ctx.arc(-20, -12, 18, 0, Math.PI * 2); ctx.arc(0, -20, 23, 0, Math.PI * 2); ctx.arc(22, -10, 17, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FDD835';
  ctx.beginPath(); ctx.arc(-8, -30, 3, 0, Math.PI * 2); ctx.arc(14, -22, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawPalmTree(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Tronco arqueado tropical
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(10, -35, 6, -72);
  ctx.stroke();

  // Folhas de palmeira
  ctx.fillStyle = '#00BFA5';
  ctx.beginPath();
  ctx.ellipse(6 - 28, -72 + 6, 26, 9, -0.4, 0, Math.PI * 2);
  ctx.ellipse(6 + 28, -72 + 6, 26, 9, 0.4, 0, Math.PI * 2);
  ctx.ellipse(6, -72 - 14, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCoralDetail(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FF4081';
  ctx.beginPath();
  ctx.arc(-10, -14, 12, 0, Math.PI * 2);
  ctx.arc(8, -18, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00E5FF';
  ctx.beginPath();
  ctx.arc(-2, -26, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCactus(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#2E7D32';
  // Tronco central
  ctx.beginPath();
  ctx.roundRect(-7, -65, 14, 65, 6);
  ctx.fill();
  // Braço esquerdo
  ctx.beginPath();
  ctx.roundRect(-24, -45, 18, 10, 4);
  ctx.roundRect(-24, -58, 10, 20, 4);
  ctx.fill();
  // Braço direito
  ctx.beginPath();
  ctx.roundRect(6, -35, 18, 10, 4);
  ctx.roundRect(14, -48, 10, 20, 4);
  ctx.fill();
  ctx.restore();
}

function drawElectricPylon(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#FFA000';
  ctx.fillRect(-6, -55, 12, 55);
  // Cristal de alta voltagem
  ctx.fillStyle = '#40C4FF';
  ctx.beginPath();
  ctx.moveTo(0, -78);
  ctx.lineTo(10, -60);
  ctx.lineTo(0, -48);
  ctx.lineTo(-10, -60);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFireBrazier(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Base do braseiro de ferro
  ctx.fillStyle = '#212121';
  ctx.fillRect(-12, -28, 24, 28);
  ctx.fillStyle = '#37474F';
  ctx.beginPath();
  ctx.roundRect(-16, -34, 32, 10, 4);
  ctx.fill();
  // Chamas animadas
  const flameH = 18 + Math.sin(performance.now() * 0.01) * 4;
  ctx.fillStyle = '#FF5722';
  ctx.beginPath();
  ctx.moveTo(-10, -34);
  ctx.lineTo(0, -34 - flameH);
  ctx.lineTo(10, -34);
  ctx.fill();
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath();
  ctx.moveTo(-5, -34);
  ctx.lineTo(0, -34 - (flameH * 0.6));
  ctx.lineTo(5, -34);
  ctx.fill();
  ctx.restore();
}

function drawMagmaCrystal(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#D50000';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-4, -40);
  ctx.lineTo(6, 0);
  ctx.fill();
  ctx.fillStyle = '#FF6D00';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(10, -32);
  ctx.lineTo(18, 0);
  ctx.fill();
  ctx.restore();
}

function drawSignpost(ctx, x, y, label, worldIndex = 0) {
  ctx.save();
  const poleColor = worldIndex === 3 ? '#212121' : worldIndex === 2 ? '#B5651D' : worldIndex === 1 ? '#006064' : '#6D4C41';
  const signColor = worldIndex === 3 ? '#BF360C' : worldIndex === 2 ? '#FFE082' : worldIndex === 1 ? '#00E5FF' : '#FBC02D';
  const textColor = worldIndex === 3 ? '#FFF59D' : worldIndex === 2 ? '#E65100' : worldIndex === 1 ? '#004D40' : '#5D4037';

  ctx.fillStyle = poleColor;
  ctx.fillRect(x - 3, y - 43, 6, 43);
  ctx.fillStyle = signColor;
  ctx.strokeStyle = poleColor;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - 36, y - 60, 72, 22, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = 'bold 9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 45);
  ctx.restore();
}
