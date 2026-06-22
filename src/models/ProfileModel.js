/**
 * Mental Calculations — Profile Model
 * Representa os dados de perfil do jogador.
 */

export const DEFAULT_PROFILE = {
  name: 'Jogador',
  avatar: '🧠',
  createdAt: null,
};

/**
 * Cria ou inicializa uma estrutura de perfil válida
 */
export function createProfile(data = {}) {
  return {
    name: data.name || DEFAULT_PROFILE.name,
    avatar: data.avatar || DEFAULT_PROFILE.avatar,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

/**
 * Valida o nome do jogador
 */
export function isValidName(name) {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 15;
}
