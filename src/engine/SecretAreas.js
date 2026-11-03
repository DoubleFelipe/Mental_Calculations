/**
 * Level design das quatro áreas secretas. Cada configuração documenta o método
 * de acesso e a ação exigida; as nuvens só ganham colisão após o desafio.
 */
export const WORLD_SECRET_AREAS = [
  {
    name: 'Gruta das Raízes',
    // MUNDO 1 — Impulso de altura: pegue o elevador secreto e salte no ápice.
    access: {
      method: 'apex-lift-jump',
      platformId: 'world-0-secret-lift',
      maxPlatformY: 58,
      hint: 'Salte do elevador quando ele tocar o céu!',
    },
    gateX: 3955,
    accessPlatform: {
      id: 'world-0-secret-lift', x: 3695, y: 310, width: 86, height: 22,
      area: 5, elevator: true, baseY: 310, rangeY: 260, speed: 0.0012,
      guideTop: 35, guideBottom: 590, secretAccess: true,
    },
    // Nuvens sobem do elevador até a gruta. Todos os degraus começam ocultos.
    routePlatforms: [
      { x: 3800, y: 205, width: 100, height: 24, area: 5, secret: true, cloud: true },
      { x: 3910, y: 130, width: 90, height: 24, area: 5, secret: true, cloud: true },
    ],
    floor: { x: 3955, y: 110, width: 190, height: 24, cloud: true },
    rewards: [
      { x: 3990, y: 58, value: 125 }, { x: 4045, y: 48, value: 125 }, { x: 4100, y: 58, value: 125 },
    ],
  },
  {
    name: 'Cofre das Marés',
    // MUNDO 2 — Salto de fé: caia pelo vão estreito à direita da ponte final.
    access: {
      method: 'faith-fall',
      trigger: { x: 3690, y: 425, width: 58, height: 150 },
      minFallSpeed: 3,
      hint: 'O vão entre as ilhas esconde uma corrente de ar.',
    },
    gateX: 4010,
    // A primeira nuvem aparece sob o jogador; os demais degraus levam ao cofre.
    routePlatforms: [
      { x: 3680, y: 535, width: 78, height: 24, area: 5, secret: true, cloud: true },
      { x: 3780, y: 455, width: 90, height: 24, area: 5, secret: true, cloud: true },
      { x: 3885, y: 370, width: 90, height: 24, area: 5, secret: true, cloud: true },
      { x: 3985, y: 265, width: 90, height: 24, area: 5, secret: true, cloud: true },
    ],
    floor: { x: 4010, y: 150, width: 190, height: 24, cloud: true },
    rewards: [
      { x: 4035, y: 98, value: 125 }, { x: 4085, y: 85, value: 125 }, { x: 4135, y: 98, value: 125 },
    ],
  },
  {
    name: 'Câmara do Delta',
    // MUNDO 3 — Desvio perigoso: salte sobre os espinhos e cruze a fenda no ar.
    access: {
      method: 'spike-leap',
      trigger: { x: 3815, y: 165, width: 110, height: 250 },
      hint: 'Um salto preciso por cima dos espinhos revela a passagem.',
    },
    gateX: 4000,
    // Nuvens contornam a fileira de espinhos e sobem até as ruínas.
    routePlatforms: [
      { x: 3750, y: 255, width: 90, height: 24, area: 5, secret: true, cloud: true },
      { x: 3855, y: 175, width: 90, height: 24, area: 5, secret: true, cloud: true },
      { x: 3960, y: 105, width: 80, height: 24, area: 5, secret: true, cloud: true },
    ],
    floor: { x: 4000, y: 80, width: 185, height: 24, cloud: true },
    rewards: [
      { x: 4025, y: 24, value: 150 }, { x: 4075, y: 18, value: 150 },
      { x: 4125, y: 24, value: 150 }, { x: 4170, y: 18, value: 150 },
    ],
  },
  {
    name: 'Santuário da Forja',
    // MUNDO 4 — Exploração: pare sobre o selo de basalto e pressione ↓.
    access: {
      method: 'down-switch',
      trigger: { x: 3530, y: 270, width: 105, height: 105 },
      hint: 'O selo sob seus pés reage à tecla ↓.',
    },
    gateX: 4010,
    // O selo abre a escadaria secreta, que desvia da rota baixa da forja.
    routePlatforms: [
      { x: 3690, y: 280, width: 100, height: 24, area: 5, secret: true, cloud: true },
      { x: 3800, y: 200, width: 90, height: 24, area: 5, secret: true, cloud: true },
      { x: 3910, y: 120, width: 85, height: 24, area: 5, secret: true, cloud: true },
    ],
    floor: { x: 4010, y: 120, width: 190, height: 24, cloud: true },
    rewards: [
      { x: 4050, y: 65, value: 150 }, { x: 4105, y: 55, value: 150 }, { x: 4160, y: 65, value: 150 },
    ],
  },
];

// Luzes das câmaras: a posição da entrada não é marcada por uma parede óbvia.
const GATE_COLORS = [
  { light: '#A5D66A' },
  { light: '#80DEEA' },
  { light: '#FFD54F' },
  { light: '#FF7043' },
];

/** A câmara recebe um brilho de descoberta; nenhuma parede indica a entrada. */
export function drawSecretEntrance(ctx, area, worldIndex, cameraX, cameraY, revealProgress) {
  if (revealProgress <= 0) return;
  const floor = area.floor;
  const x = area.gateX - cameraX;
  const y = floor.y - 55 - cameraY;
  if (x < -100 || x > ctx.canvas.width + 100) return;

  const colors = GATE_COLORS[worldIndex] || GATE_COLORS[0];
  const progress = Math.max(0, Math.min(1, revealProgress));
  ctx.save();
  const roomX = floor.x - cameraX;
  const roomY = floor.y - 105 - cameraY;
  ctx.globalAlpha = progress * 0.2;
  ctx.fillStyle = colors.light;
  ctx.fillRect(roomX, roomY, floor.width, 105);
  ctx.globalAlpha = progress;
  const glow = ctx.createRadialGradient(x, y, 4, x, y, 95);
  glow.addColorStop(0, `${colors.light}CC`);
  glow.addColorStop(1, `${colors.light}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(x - 95, y - 50, 190, 105);

  if (progress >= 1) {
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = colors.light;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(area.name, floor.x + floor.width / 2 - cameraX, floor.y - 114 - cameraY);
  }
  ctx.restore();
}

/** Decoração exclusiva da câmara; cada mundo conserva sua própria identidade. */
export function drawSecretDecorations(ctx, area, worldIndex, cameraX, cameraY, revealProgress, frame = 0) {
  if (revealProgress <= 0) return;
  const floor = area.floor;
  const left = floor.x - cameraX;
  const top = floor.y - 105 - cameraY;
  const alpha = Math.max(0, Math.min(1, revealProgress));
  if (left > ctx.canvas.width || left + floor.width < 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  // Moldura discreta da sala, com luz própria conforme o tema de cada mundo.
  const themes = [
    { wall: '#193A2A', trim: '#75C96E', glow: '#B8FF8B' },
    { wall: '#103B49', trim: '#45C7C9', glow: '#8CFFFF' },
    { wall: '#51331E', trim: '#E8AE4D', glow: '#FFE58A' },
    { wall: '#321E20', trim: '#FF7043', glow: '#FFB15C' },
  ];
  const theme = themes[worldIndex] || themes[0];
  ctx.fillStyle = `${theme.wall}88`;
  ctx.fillRect(left + 4, top + 7, floor.width - 8, 98);
  ctx.strokeStyle = `${theme.trim}AA`;
  ctx.lineWidth = 3;
  ctx.strokeRect(left + 5, top + 8, floor.width - 10, 96);

  if (worldIndex === 0) {
    // Gruta das Raízes: raízes pendentes, musgo e cogumelos luminosos.
    ctx.strokeStyle = '#70A85B'; ctx.lineWidth = 5;
    for (const offset of [30, 90, 150]) {
      ctx.beginPath(); ctx.moveTo(left + offset, top + 9);
      ctx.bezierCurveTo(left + offset - 8, top + 36, left + offset + 10, top + 46, left + offset, top + 64); ctx.stroke();
    }
    for (const [offset, color] of [[42, '#FF8A80'], [135, '#B39DDB']]) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(left + offset, top + 87, 10, 6, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#E7DCC4'; ctx.fillRect(left + offset - 2, top + 87, 4, 12);
    }
    ctx.fillStyle = '#85D66B'; ctx.fillRect(left + 15, top + 99, floor.width - 30, 5);
  } else if (worldIndex === 1) {
    // Cofre das Marés: corais, conchas e bolhas que sobem lentamente.
    ctx.strokeStyle = '#FF8A65'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const offset of [25, 160]) {
      ctx.beginPath(); ctx.moveTo(left + offset, top + 101); ctx.lineTo(left + offset, top + 72);
      ctx.lineTo(left + offset - 10, top + 60); ctx.moveTo(left + offset, top + 82); ctx.lineTo(left + offset + 12, top + 68); ctx.stroke();
    }
    ctx.fillStyle = '#FFE082'; ctx.beginPath(); ctx.arc(left + 88, top + 96, 13, Math.PI, 0); ctx.fill();
    for (const [offset, phase] of [[60, 0], [125, 1.6]]) {
      const bob = Math.sin(frame / 18 + phase) * 5;
      ctx.strokeStyle = '#8CFFFF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(left + offset, top + 42 - bob, 7, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (worldIndex === 2) {
    // Câmara do Delta: ruínas do deserto marcadas por inscrições elétricas.
    ctx.fillStyle = '#8D6337';
    for (const offset of [23, 156]) {
      ctx.fillRect(left + offset, top + 31, 18, 69);
      ctx.fillRect(left + offset - 5, top + 26, 28, 7);
      ctx.fillRect(left + offset - 5, top + 98, 28, 7);
    }
    ctx.strokeStyle = '#FFE082'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(left + 47, top + 49); ctx.lineTo(left + 55, top + 40); ctx.lineTo(left + 62, top + 53);
    ctx.lineTo(left + 70, top + 44); ctx.lineTo(left + 78, top + 55); ctx.stroke();
    ctx.fillStyle = theme.glow; ctx.globalAlpha *= 0.55 + Math.sin(frame / 12) * 0.2;
    ctx.beginPath(); ctx.arc(left + 96, top + 65, 9, 0, Math.PI * 2); ctx.fill();
  } else {
    // Santuário da Forja: cristais de basalto e braseiros de magma pulsantes.
    for (const [offset, color] of [[35, '#FF7043'], [145, '#FFCA28']]) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(left + offset, top + 100);
      ctx.lineTo(left + offset - 9, top + 67); ctx.lineTo(left + offset, top + 43);
      ctx.lineTo(left + offset + 11, top + 71); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFD180'; ctx.fillRect(left + offset - 2, top + 75, 4, 21);
    }
    ctx.fillStyle = theme.glow; ctx.globalAlpha *= 0.45 + Math.sin(frame / 10) * 0.2;
    ctx.beginPath(); ctx.arc(left + 96, top + 68, 18, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
