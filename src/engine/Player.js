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

export function drawPlayer(ctx, player, cameraX, cameraY, skinColor = '#222') {
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
  ctx.beginPath();
  ctx.arc(cx, headY, 8, 0, Math.PI * 2);
  ctx.stroke();

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
