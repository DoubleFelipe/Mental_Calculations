/**
 * Mental Calculations — Storage Service
 * Gerencia persistência de dados via LocalStorage
 */

const STORAGE_KEYS = {
  GAME_STATE: 'mc_game_state',
  SETTINGS: 'mc_settings',
  PROFILE: 'mc_profile',
};

// Estado inicial padrão do jogo
const DEFAULT_GAME_STATE = {
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
  equippedSkin: 'default',
};

const DEFAULT_SETTINGS = {
  musicVolume: 80,
  sfxVolume: 50,
  language: 'pt-br',
};

const DEFAULT_PROFILE = {
  name: 'Jogador',
  avatar: '🧠',
  createdAt: null,
};

/**
 * Salva dados no LocalStorage
 */
export function saveData(key, data) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return false;
  }
}

/**
 * Carrega dados do LocalStorage
 */
export function loadData(key, defaultValue = null) {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return defaultValue;
  }
}

/**
 * Salva o estado do jogo
 */
export function saveGameState(state) {
  return saveData(STORAGE_KEYS.GAME_STATE, state);
}

/**
 * Carrega o estado do jogo (ou retorna padrão)
 */
export function loadGameState() {
  return loadData(STORAGE_KEYS.GAME_STATE, { ...DEFAULT_GAME_STATE });
}

/**
 * Salva as configurações
 */
export function saveSettings(settings) {
  return saveData(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Carrega as configurações (ou retorna padrão)
 */
export function loadSettings() {
  return loadData(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
}

/**
 * Salva o perfil do jogador
 */
export function saveProfile(profile) {
  return saveData(STORAGE_KEYS.PROFILE, profile);
}

/**
 * Carrega o perfil do jogador (ou retorna padrão)
 */
export function loadProfile() {
  const profile = loadData(STORAGE_KEYS.PROFILE, { ...DEFAULT_PROFILE });
  if (!profile.createdAt) {
    profile.createdAt = new Date().toISOString();
  }
  return profile;
}

/**
 * Reseta todos os dados do jogo
 */
export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
}

export { STORAGE_KEYS, DEFAULT_GAME_STATE, DEFAULT_SETTINGS, DEFAULT_PROFILE };
