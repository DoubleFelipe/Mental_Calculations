/**
 * Mental Calculations — Physics Engine
 * Física básica: gravidade, colisão AABB
 */

export const GRAVITY = 0.6;
export const FRICTION = 0.8;
export const MAX_FALL_SPEED = 12;

/** Detecta colisão AABB entre dois retângulos */
export function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/** Verifica se player está em cima de uma plataforma */
export function isOnPlatform(player, platform) {
  const playerBottom = player.y + player.height;
  const playerRight = player.x + player.width;
  return (
    playerBottom >= platform.y &&
    playerBottom <= platform.y + 10 &&
    playerRight > platform.x + 5 &&
    player.x < platform.x + platform.width - 5 &&
    player.vy >= 0
  );
}

/** Aplica gravidade ao player */
export function applyGravity(player) {
  player.vy = Math.min(player.vy + GRAVITY, MAX_FALL_SPEED);
  player.y += player.vy;
  player.x += player.vx;
  player.vx *= FRICTION;
  if (Math.abs(player.vx) < 0.1) player.vx = 0;
}

/** Limita player aos limites do nível */
export function clampToLevel(player, levelWidth, levelHeight) {
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > levelWidth) player.x = levelWidth - player.width;
  if (player.y > levelHeight) {
    player.y = levelHeight - player.height - 100;
    player.vy = 0;
    return true; // caiu
  }
  return false;
}
