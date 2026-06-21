/**
 * Mental Calculations — Settings Model
 * Representa as configurações do jogo.
 */

export const DEFAULT_SETTINGS = {
  musicVolume: 80,
  sfxVolume: 50,
  language: 'pt-br',
};

/**
 * Valida se um valor de volume é válido (0 a 100)
 */
export function isValidVolume(volume) {
  const parsed = parseInt(volume);
  return !isNaN(parsed) && parsed >= 0 && parsed <= 100;
}
