/**
 * Mental Calculations — Background
 * Cenário com céu, nuvens e colinas (inspirado na referência)
 */

export function drawBackground(ctx, width, height, cameraX, frame) {
  // Céu gradiente
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#87CEEB');
  skyGrad.addColorStop(0.6, '#B0E2FF');
  skyGrad.addColorStop(1, '#E0F7FA');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Nuvens (parallax lento)
  drawClouds(ctx, width, height, cameraX * 0.1, frame);

  // Colinas distantes (parallax médio)
  drawHills(ctx, width, height, cameraX * 0.3, '#4CAF50', 0.7, 120);

  // Colinas próximas (parallax rápido)
  drawHills(ctx, width, height, cameraX * 0.5, '#388E3C', 0.85, 80);

  // Arbustos
  drawBushes(ctx, width, height, cameraX * 0.6);
}

function drawClouds(ctx, w, h, offsetX, frame) {
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  const clouds = [
    { x: 100, y: 50, s: 1.2 },
    { x: 400, y: 80, s: 0.8 },
    { x: 700, y: 40, s: 1.0 },
    { x: 1000, y: 70, s: 0.9 },
    { x: 1300, y: 55, s: 1.1 },
  ];
  clouds.forEach(c => {
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
  bushes.forEach(bx => {
    const x = ((bx - offsetX) % (w + 100));
    const y = h * 0.82;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 3, 12, 0, Math.PI * 2);
    ctx.arc(x + 28, y, 14, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Casa decorativa (como na inspiração) */
export function drawHouse(ctx, x, y, cameraX, cameraY = 0) {
  const hx = x - cameraX;
  const hy = y - cameraY;
  ctx.save();

  // Corpo da casa
  ctx.fillStyle = '#FFB74D';
  ctx.fillRect(hx, hy - 60, 70, 60);

  // Telhado vermelho
  ctx.fillStyle = '#EF5350';
  ctx.beginPath();
  ctx.moveTo(hx - 5, hy - 60);
  ctx.lineTo(hx + 35, hy - 95);
  ctx.lineTo(hx + 75, hy - 60);
  ctx.closePath();
  ctx.fill();

  // Janela
  ctx.fillStyle = '#42A5F5';
  ctx.fillRect(hx + 40, hy - 50, 20, 20);

  // Porta
  ctx.fillStyle = '#8D6E63';
  ctx.fillRect(hx + 10, hy - 40, 18, 40);

  // Maçaneta
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.arc(hx + 24, hy - 20, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Decorações ancoradas diretamente nas plataformas estáticas do mapa. */
export function drawWorldScenery(ctx, cameraX, cameraY, platforms = []) {
  const scenery = [
    { type: 'tree', platformIndex: 0, offset: 250, scale: 1.1 },
    { type: 'tree', platformIndex: 1, offset: 170, scale: 0.75 },
    { type: 'tree', platformIndex: 2, offset: 110, scale: 0.7 },
    { type: 'bush', platformIndex: 3, offset: 90, scale: 1 },
    { type: 'tree', platformIndex: 5, offset: 70, scale: 0.6 },
    { type: 'tree', platformIndex: 6, offset: 50, scale: 0.8 },
    { type: 'bush', platformIndex: 8, offset: 25, scale: 0.9 },
    { type: 'tree', platformIndex: 9, offset: 80, scale: 0.65 },
    { type: 'tree', platformIndex: 10, offset: 70, scale: 0.55 },
    { type: 'bush', platformIndex: 14, offset: 80, scale: 1 },
    { type: 'tree', platformIndex: 14, offset: 110, scale: 0.75 },
    { type: 'tree', platformIndex: 15, offset: 100, scale: 0.9 },
    { type: 'sign', platformIndex: 0, offset: 300, label: 'INÍCIO' },
    { type: 'sign', platformIndex: 2, offset: 25, label: 'DESAFIOS' },
    { type: 'sign', platformIndex: 5, offset: 130, label: 'ATENÇÃO' },
    { type: 'sign', platformIndex: 14, offset: 30, label: 'FINAL' },
  ];

  scenery.forEach((item) => {
    const platform = platforms[item.platformIndex];
    // Decorações não acompanham nem ficam presas a plataformas móveis.
    if (!platform || platform.moving) return;
    const x = platform.x + item.offset - cameraX;
    const y = platform.y - cameraY;
    if (x < -180 || x > ctx.canvas.width + 180) return;
    if (item.type === 'tree') drawTree(ctx, x, y, item.scale);
    if (item.type === 'bush') drawBushDetail(ctx, x, y, item.scale);
    if (item.type === 'sign') drawSignpost(ctx, x, y, item.label);
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

function drawSignpost(ctx, x, y, label) {
  ctx.save();
  ctx.fillStyle = '#6D4C41';
  ctx.fillRect(x - 3, y - 43, 6, 43);
  ctx.fillStyle = '#FBC02D';
  ctx.strokeStyle = '#8D6E63';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - 34, y - 60, 68, 22, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5D4037';
  ctx.font = 'bold 9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 45);
  ctx.restore();
}

/** Castelo medieval e portal de encerramento do mundo. */
export function drawCastle(ctx, x, y, cameraX, cameraY, frame = 0) {
  const cx = x - cameraX;
  const cy = y - cameraY;
  ctx.save();
  ctx.fillStyle = '#78909C';
  ctx.strokeStyle = '#455A64';
  ctx.lineWidth = 3;
  ctx.fillRect(cx, cy - 150, 190, 150);
  ctx.fillRect(cx - 26, cy - 190, 58, 190);
  ctx.fillRect(cx + 158, cy - 190, 58, 190);
  ctx.strokeRect(cx, cy - 150, 190, 150);
  ctx.strokeRect(cx - 26, cy - 190, 58, 190);
  ctx.strokeRect(cx + 158, cy - 190, 58, 190);

  ctx.fillStyle = '#EF5350';
  ctx.beginPath(); ctx.moveTo(cx - 34, cy - 190); ctx.lineTo(cx + 3, cy - 235); ctx.lineTo(cx + 40, cy - 190); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 150, cy - 190); ctx.lineTo(cx + 187, cy - 235); ctx.lineTo(cx + 224, cy - 190); ctx.fill();
  ctx.fillStyle = '#263238';
  ctx.fillRect(cx + 74, cy - 84, 42, 84);
  ctx.beginPath(); ctx.arc(cx + 95, cy - 84, 21, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#90CAF9';
  ctx.fillRect(cx + 12, cy - 133, 16, 22); ctx.fillRect(cx + 166, cy - 133, 16, 22);

  // Bandeiras animadas.
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx + 3, cy - 235); ctx.lineTo(cx + 3, cy - 270); ctx.moveTo(cx + 187, cy - 235); ctx.lineTo(cx + 187, cy - 270); ctx.stroke();
  ctx.fillStyle = '#FFCA28';
  const wave = Math.sin(frame * 0.05) * 3;
  ctx.beginPath(); ctx.moveTo(cx + 3, cy - 268); ctx.lineTo(cx + 34, cy - 260 + wave); ctx.lineTo(cx + 3, cy - 250); ctx.fill();
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath(); ctx.moveTo(cx + 187, cy - 268); ctx.lineTo(cx + 218, cy - 260 - wave); ctx.lineTo(cx + 187, cy - 250); ctx.fill();

  ctx.fillStyle = '#FFF59D';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIM DO MUNDO', cx + 95, cy - 160);
  ctx.restore();
}
