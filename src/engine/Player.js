/**
 * Mental Calculations — Player (stick figure)
 * Desenha e controla o personagem stick figure
 */

export function createPlayer(x = 100, y = 300) {
  return {
    x, y,
    width: 30,
    height: 50,
    vx: 0, vy: 0,
    speed: 4,
    jumpForce: -11,
    isGrounded: false,
    facingRight: true,
    isWalking: false,
    walkFrame: 0,
    walkTimer: 0,
  };
}

const SKINS = {
  default: { color: '#222' },
  skin_ninja: { color: '#263238', accent: '#D32F2F' },
  skin_astronaut: { color: '#ECEFF1', accent: '#42A5F5' },
  skin_wizard: { color: '#1565C0', accent: '#FFD54F' },
  skin_robot: { color: '#78909C', accent: '#76FF03' },
  skin_superhero: { color: '#D32F2F', accent: '#FFD54F' },
};

export function drawPlayer(ctx, player, cameraX, cameraY, skinId = 'default') {
  const skin = SKINS[skinId] || SKINS.default;
  const skinColor = skin.color;
  const px = player.x - cameraX;
  const py = player.y - cameraY;
  const cx = px + player.width / 2;
  const headY = py + 8;

  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = skinColor;
  ctx.fillStyle = skinColor;
  ctx.lineCap = 'round';

  // Cabeça
  if (skinId === 'skin_robot') {
    ctx.fillStyle = '#B0BEC5';
    ctx.fillRect(cx - 8, headY - 8, 16, 16);
    ctx.strokeRect(cx - 8, headY - 8, 16, 16);
  } else {
    ctx.beginPath();
    ctx.arc(cx, headY, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (skinId === 'skin_astronaut') {
    ctx.fillStyle = '#90CAF9';
    ctx.beginPath(); ctx.arc(cx, headY, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = skinColor; ctx.stroke();
  }

  // Olhos simples
  const eyeDir = player.facingRight ? 2 : -2;
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(cx + eyeDir, headY - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Corpo
  ctx.beginPath();
  ctx.moveTo(cx, headY + 8);
  ctx.lineTo(cx, py + 32);
  ctx.stroke();

  // Braços (animados)
  const armSwing = player.isWalking ? Math.sin(player.walkFrame * 0.3) * 12 : 0;
  ctx.beginPath();
  ctx.moveTo(cx, py + 20);
  ctx.lineTo(cx - 12, py + 26 + armSwing);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, py + 20);
  ctx.lineTo(cx + 12, py + 26 - armSwing);
  ctx.stroke();

  // Pernas (animadas)
  const legSwing = player.isWalking ? Math.sin(player.walkFrame * 0.3) * 10 : 0;
  ctx.beginPath();
  ctx.moveTo(cx, py + 32);
  ctx.lineTo(cx - 8 + legSwing, py + player.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, py + 32);
  ctx.lineTo(cx + 8 - legSwing, py + player.height);
  ctx.stroke();

  // Roupa e acessórios ficam por cima do personagem para cada skin ser reconhecível.
  if (skinId === 'skin_ninja') {
    ctx.strokeStyle = skin.accent;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 9, headY); ctx.lineTo(cx + 9, headY); ctx.stroke();
  } else if (skinId === 'skin_wizard') {
    ctx.fillStyle = skin.color;
    ctx.beginPath(); ctx.moveTo(cx - 10, headY - 7); ctx.lineTo(cx, headY - 24); ctx.lineTo(cx + 10, headY - 7); ctx.fill();
    ctx.fillStyle = skin.accent;
    ctx.beginPath(); ctx.arc(cx, py + 25, 2.5, 0, Math.PI * 2); ctx.fill();
  } else if (skinId === 'skin_robot') {
    ctx.strokeStyle = '#37474F';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, headY - 8); ctx.lineTo(cx, headY - 15); ctx.stroke();
    ctx.fillStyle = skin.accent; ctx.beginPath(); ctx.arc(cx, headY - 16, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = skin.accent;
    ctx.beginPath(); ctx.arc(cx - 4, headY - 1, 1.5, 0, Math.PI * 2); ctx.arc(cx + 4, headY - 1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#CFD8DC'; ctx.beginPath(); ctx.moveTo(cx - 4, py + 25); ctx.lineTo(cx + 4, py + 25); ctx.stroke();
  } else if (skinId === 'skin_superhero') {
    ctx.fillStyle = '#1565C0';
    ctx.beginPath(); ctx.moveTo(cx + 5, py + 19); ctx.lineTo(cx + 24, py + 38); ctx.lineTo(cx + 5, py + 33); ctx.fill();
    ctx.fillStyle = skin.accent;
    ctx.beginPath(); ctx.moveTo(cx, py + 20); ctx.lineTo(cx + 5, py + 25); ctx.lineTo(cx, py + 30); ctx.lineTo(cx - 5, py + 25); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('M', cx, py + 28);
  }

  ctx.restore();
}

export function updatePlayerAnimation(player) {
  if (player.isWalking) {
    player.walkTimer++;
    if (player.walkTimer >= 3) {
      player.walkTimer = 0;
      player.walkFrame++;
    }
  } else {
    player.walkFrame = 0;
    player.walkTimer = 0;
  }
}
