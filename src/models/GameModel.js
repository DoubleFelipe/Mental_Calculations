/**
 * Mental Calculations — Game Model
 * Representa os dados e as regras de negócio puras do estado do jogo.
 */

export const DEFAULT_GAME_STATE = {
  currentWorld: 0,
  currentLevel: 0,
  unlockedWorlds: [true, false, false, false],
  // Cada mundo tem 5 fases: true = desbloqueada
  unlockedLevels: [
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
    [true, false, false, false, false],
  ],
  completedLevels: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ],
  // Estrelas por fase (0-3)
  levelStars: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  credits: 100,
  lives: 3,
  totalScore: 0,
  totalCorrect: 0,
  totalWrong: 0,
  totalTime: 0,
  questionsAnswered: 0,
  purchasedItems: [],
  powerUpUses: {},
  equippedSkin: 'default',
};

/**
 * Calcula estrelas com base na porcentagem de acertos
 */
export function calculateStars(correct, total) {
  if (total === 0) return 0;
  const pct = (correct / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 75) return 2;
  if (pct >= 60) return 1;
  return 0;
}

/**
 * Verifica se o jogador passou na fase (>60%)
 */
export function didPassLevel(correct, total) {
  if (total === 0) return false;
  return (correct / total) * 100 >= 60;
}

/**
 * Calcula créditos ganhos na fase
 */
export function calculateCredits(stars, difficulty) {
  const base = { easy: 10, medium: 20, hard: 30 };
  const mult = base[difficulty] || 10;
  return stars * mult;
}

/**
 * Calcula pontuação da fase
 */
export function calculateScore(correct, total, avgTimeMs, difficulty) {
  const baseScore = correct * 100;
  const diffMult = { easy: 1, medium: 1.5, hard: 2 };
  const timeMult = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25;
  const timeBonus = Math.max(0, (timeMult * 1000 - avgTimeMs) / 100);
  return Math.round((baseScore + timeBonus) * (diffMult[difficulty] || 1));
}

/**
 * Retorna a dificuldade de uma fase baseada no mundo e nível
 */
export function getLevelDifficulty(worldIndex, levelIndex) {
  const map = [
    ['easy', 'easy', 'medium', 'medium', 'hard'],
    ['easy', 'medium', 'medium', 'hard', 'hard'],
    ['medium', 'medium', 'hard', 'hard', 'hard'],
    ['medium', 'hard', 'hard', 'hard', 'hard'],
  ];
  return map[worldIndex]?.[levelIndex] || 'easy';
}

/**
 * Atualiza o estado do jogo após completar uma fase
 */
export function processLevelComplete(gameState, worldIndex, levelIndex, correct, total, avgTimeMs, creditMultiplier = 1) {
  const newState = JSON.parse(JSON.stringify(gameState));
  const difficulty = getLevelDifficulty(worldIndex, levelIndex);
  const stars = calculateStars(correct, total);
  const passed = didPassLevel(correct, total);
  const credits = calculateCredits(stars, difficulty) * creditMultiplier;
  const score = calculateScore(correct, total, avgTimeMs, difficulty);

  // Atualizar estrelas (manter o melhor resultado)
  if (stars > newState.levelStars[worldIndex][levelIndex]) {
    newState.levelStars[worldIndex][levelIndex] = stars;
  }

  // Marcar fase como concluída
  newState.completedLevels[worldIndex][levelIndex] = true;

  // Desbloquear próxima fase se passou
  if (passed) {
    if (levelIndex + 1 < 5) {
      newState.unlockedLevels[worldIndex][levelIndex + 1] = true;
    } else if (worldIndex + 1 < 4) {
      // Desbloquear próximo mundo
      newState.unlockedWorlds[worldIndex + 1] = true;
    }
  }

  // Atualizar estatísticas
  newState.credits += credits;
  newState.totalScore += score;
  newState.totalCorrect += correct;
  newState.totalWrong += (total - correct);
  newState.totalTime += avgTimeMs * total;
  newState.questionsAnswered += total;

  return { newState, stars, passed, credits, score };
}

/**
 * Verifica se o jogador pode gastar um valor de créditos
 */
export function canSpendCredits(gameState, amount) {
  return gameState.credits >= amount;
}

/**
 * Retorna um novo estado com os créditos descontados
 */
export function spendCredits(gameState, amount) {
  if (!canSpendCredits(gameState, amount)) return null;
  return {
    ...gameState,
    credits: gameState.credits - amount
  };
}

/**
 * Adiciona créditos ao estado e retorna o novo estado
 */
export function addCredits(gameState, amount) {
  return {
    ...gameState,
    credits: gameState.credits + amount
  };
}

/**
 * Realiza a compra de um item da loja, se aplicável
 */
export function purchaseItem(gameState, itemId, price, uses = 0) {
  const isPowerUp = uses > 0;
  if (gameState.purchasedItems.includes(itemId) && !isPowerUp) return null;
  if (!canSpendCredits(gameState, price)) return null;

  return {
    ...gameState,
    credits: gameState.credits - price,
    purchasedItems: gameState.purchasedItems.includes(itemId)
      ? gameState.purchasedItems
      : [...gameState.purchasedItems, itemId],
    powerUpUses: isPowerUp
      ? { ...gameState.powerUpUses, [itemId]: (gameState.powerUpUses?.[itemId] || 0) + uses }
      : gameState.powerUpUses,
  };
}

/** Consome uma unidade de um power-up do inventário. */
export function consumePowerUp(gameState, itemId) {
  const remaining = gameState.powerUpUses?.[itemId] || 0;
  if (remaining <= 0) return null;
  return {
    ...gameState,
    powerUpUses: { ...gameState.powerUpUses, [itemId]: remaining - 1 },
  };
}

/**
 * Equipa uma skin
 */
export function equipSkin(gameState, skinId) {
  return {
    ...gameState,
    equippedSkin: skinId
  };
}

/**
 * Perde uma vida (mínimo 0)
 */
export function loseLife(gameState) {
  return {
    ...gameState,
    lives: Math.max(0, gameState.lives - 1)
  };
}

/**
 * Reseta as vidas do jogador
 */
export function resetLives(gameState) {
  return {
    ...gameState,
    lives: 3
  };
}
