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
export function drawHouse(ctx, x, y, cameraX) {
  const hx = x - cameraX;
  ctx.save();

  // Corpo da casa
  ctx.fillStyle = '#FFB74D';
  ctx.fillRect(hx, y - 60, 70, 60);

  // Telhado vermelho
  ctx.fillStyle = '#EF5350';
  ctx.beginPath();
  ctx.moveTo(hx - 5, y - 60);
  ctx.lineTo(hx + 35, y - 95);
  ctx.lineTo(hx + 75, y - 60);
  ctx.closePath();
  ctx.fill();

  // Janela
  ctx.fillStyle = '#42A5F5';
  ctx.fillRect(hx + 40, y - 50, 20, 20);

  // Porta
  ctx.fillStyle = '#8D6E63';
  ctx.fillRect(hx + 10, y - 40, 18, 40);

  // Maçaneta
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.arc(hx + 24, y - 20, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
