/**
 * Mental Calculations — Settings Model
 * Representa as configurações do jogo.
 */

export const DEFAULT_SETTINGS = {
  musicVolume: 80,
  sfxVolume: 50,
  language: 'pt-br',
  doubleJump: false,
  difficulty: 'medium',
};

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Fácil', timeLimit: 90 },
  { value: 'medium', label: 'Médio', timeLimit: 60 },
  { value: 'hard', label: 'Difícil', timeLimit: 45 },
];

const QUESTION_TIME_LIMITS = Object.fromEntries(
  DIFFICULTY_OPTIONS.map(({ value, timeLimit }) => [value, timeLimit]),
);

export function isValidDifficulty(difficulty) {
  return Object.hasOwn(QUESTION_TIME_LIMITS, difficulty);
}

export function getQuestionTimeLimit(difficulty) {
  return QUESTION_TIME_LIMITS[difficulty] ?? QUESTION_TIME_LIMITS[DEFAULT_SETTINGS.difficulty];
}

export function getDifficultyLabel(difficulty) {
  return DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label
    ?? DIFFICULTY_OPTIONS.find((option) => option.value === DEFAULT_SETTINGS.difficulty).label;
}

/**
 * Valida se um valor de volume é válido (0 a 100)
 */
export function isValidVolume(volume) {
  const parsed = parseInt(volume);
  return !isNaN(parsed) && parsed >= 0 && parsed <= 100;
}
