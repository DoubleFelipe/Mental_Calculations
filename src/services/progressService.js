/**
 * Mental Calculations — Progress Service
 * Lógica de progressão, desbloqueio e cálculo de estrelas
 */

/**
 * Calcula estrelas com base na porcentagem de acertos
 * @param {number} correct - Acertos
 * @param {number} total - Total de questões
 * @returns {number} 0-3 estrelas
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
  // Mundo 0: fácil→fácil→médio→médio→difícil
  // Mundo 1: fácil→médio→médio→difícil→difícil
  // Mundo 2: médio→médio→difícil→difícil→difícil
  // Mundo 3: médio→difícil→difícil→difícil→difícil
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
export function processLevelComplete(gameState, worldIndex, levelIndex, correct, total, avgTimeMs) {
  const newState = JSON.parse(JSON.stringify(gameState));
  const difficulty = getLevelDifficulty(worldIndex, levelIndex);
  const stars = calculateStars(correct, total);
  const passed = didPassLevel(correct, total);
  const credits = calculateCredits(stars, difficulty);
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
