/**
 * Saco de dinheiro colecionável do mapa de plataforma.
 * Mantém a animação e o desenho junto do restante do motor 2D.
 */
export class MoneyBag {
  constructor({ id, x, y, phase = 0, collected = false, value = 10 }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 30;
    this.phase = phase;
    this.value = value;
    this.collected = collected;
    this.floatX = 0;
    this.floatY = 0;
  }

  update(time) {
    // Pequenas oscilações em dois eixos criam uma flutuação contínua e suave.
    this.floatY = Math.sin(time / 420 + this.phase) * 9;
    this.floatX = Math.sin(time / 850 + this.phase) * 4;
  }

  draw(ctx, cameraX, cameraY, time) {
    if (this.collected) return;
    this.update(time);

    const x = this.x + this.floatX - cameraX;
    const y = this.y + this.floatY - cameraY;

    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#7A4B12';
    ctx.fillStyle = '#D99A32';

    // Corpo arredondado, amarração e símbolo de moeda desenhados no canvas.
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 8);
    ctx.quadraticCurveTo(x + 14, y + 5, x + 22, y + 8);
    ctx.lineTo(x + 25, y + 24);
    ctx.quadraticCurveTo(x + 14, y + 32, x + 3, y + 24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 8, y + 7);
    ctx.lineTo(x + 14, y + 3);
    ctx.lineTo(x + 20, y + 7);
    ctx.moveTo(x + 11, y + 6);
    ctx.lineTo(x + 17, y + 9);
    ctx.stroke();

    ctx.fillStyle = '#FFF0B3';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', x + 14, y + 19);
    ctx.restore();
  }
}

// Posições distribuídas pelos trechos de plataforma de cada mundo.
const WORLD_MONEY_BAGS = [
  [[285, 472], [720, 390], [1100, 210], [1700, 300], [2520, 260]],
  [[265, 470], [660, 400], [1370, 145], [1880, 310], [2650, 235]],
  [[280, 460], [670, 370], [1240, 190], [1900, 350], [2550, 115]],
  [[280, 470], [670, 390], [1440, 120], [2100, 320], [2640, 110]],
];

/** Cria os sacos do mundo, preservando as coletas já salvas no perfil. */
export function createWorldMoneyBags(worldIndex, collectedIds = []) {
  const placements = WORLD_MONEY_BAGS[worldIndex] || WORLD_MONEY_BAGS[0];
  return placements.map(([x, y], index) => {
    const id = `world-${worldIndex}-bag-${index}`;
    return new MoneyBag({
      id,
      x,
      y,
      phase: index * 1.37 + worldIndex * 0.61,
      collected: collectedIds.includes(id),
    });
  });
}
