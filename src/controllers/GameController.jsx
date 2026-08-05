import { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  DEFAULT_GAME_STATE,
  processLevelComplete,
  addCredits as addCreditsModel,
  spendCredits as spendCreditsModel,
  purchaseItem as purchaseItemModel,
  consumePowerUp as consumePowerUpModel,
  equipSkin as equipSkinModel,
  loseLife as loseLifeModel,
  resetLives as resetLivesModel,
} from '../models/GameModel';
import { DEFAULT_SETTINGS, isValidVolume } from '../models/SettingsModel';
import { createProfile } from '../models/ProfileModel';
import { progressApi, shopApi, authApi } from '../services/apiService';
import { isAuthenticated, clearAuth, getStoredUser } from '../services/authService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useLocalStorage('mc_game_state', { ...DEFAULT_GAME_STATE });
  const [settings, setSettings] = useLocalStorage('mc_settings', { ...DEFAULT_SETTINGS });
  const [profile, setProfile] = useLocalStorage('mc_profile', createProfile());

  // Estado de autenticação
  const [authUser, setAuthUser] = useLocalStorage('mc_auth_user', null);
  const [isOnline, setIsOnline] = useLocalStorage('mc_is_online', false);

  // Ref para evitar múltiplas sincronizações simultâneas
  const syncingRef = useRef(false);

  // -----------------------------------------------
  // Ao montar, verificar autenticação e sincronizar
  // -----------------------------------------------
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && isAuthenticated()) {
      setAuthUser(storedUser);
      setIsOnline(true);
      syncFromServer();
    }

    // Listener para evento de token expirado/inválido
    const handleUnauthorized = () => {
      clearAuth();
      setAuthUser(null);
      setIsOnline(false);
    };
    window.addEventListener('mc:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('mc:unauthorized', handleUnauthorized);
  }, []); // eslint-disable-line

  // -----------------------------------------------
  // Garantir integridade do estado em migrações
  // -----------------------------------------------
  useEffect(() => {
    const merged = { ...DEFAULT_GAME_STATE, ...gameState };
    if (JSON.stringify(merged) !== JSON.stringify(gameState)) {
      setGameState(merged);
    }
  }, []); // eslint-disable-line

  // -----------------------------------------------
  // Sincronizar estado do servidor → localStorage
  // -----------------------------------------------
  const syncFromServer = useCallback(async () => {
    if (syncingRef.current || !isAuthenticated()) return;
    syncingRef.current = true;
    try {
      const { gameState: serverState, worldProgress, levelProgress, purchasedItems } = await progressApi.getProgress();

      if (serverState) {
        setGameState((prev) => ({
          ...prev,
          credits: serverState.credits ?? prev.credits,
          lives: serverState.lives ?? prev.lives,
          totalScore: serverState.total_score == null ? prev.totalScore : Number(serverState.total_score),
          totalCorrect: serverState.total_correct ?? prev.totalCorrect,
          totalWrong: serverState.total_wrong ?? prev.totalWrong,
          totalTime: serverState.total_time_ms == null ? prev.totalTime : Number(serverState.total_time_ms),
          questionsAnswered: serverState.questions_answered ?? prev.questionsAnswered,
          equippedSkin: serverState.equipped_skin ?? prev.equippedSkin,
          // Mapear arrays de progresso do servidor para formato local
          unlockedWorlds: mapWorldUnlocks(worldProgress),
          unlockedLevels: mapLevelUnlocks(levelProgress, 'is_unlocked'),
          completedLevels: mapLevelUnlocks(levelProgress, 'is_completed'),
          levelStars: mapLevelStars(levelProgress),
          purchasedItems: (purchasedItems || []).map((p) => p.item?.item_key).filter(Boolean),
          powerUpUses: Object.fromEntries((purchasedItems || [])
            .filter((p) => p.item?.type === 'powerup')
            .map((p) => [p.item.item_key, p.uses_remaining || 0])),
        }));
      }

      // Sincronizar perfil com dados do servidor
      const { user } = await authApi.getMe();
      if (user) {
        setProfile((prev) => createProfile({ ...prev, name: user.name, avatar: user.avatar_url }));
        setAuthUser(user);
      }
    } catch (err) {
      console.warn('Falha ao sincronizar do servidor (modo offline):', err.message);
      setIsOnline(false);
    } finally {
      syncingRef.current = false;
    }
  }, [setGameState, setProfile, setAuthUser, setIsOnline]);

  // -----------------------------------------------
  // Helpers de mapeamento servidor → local
  // -----------------------------------------------
  function mapWorldUnlocks(worldProgress = []) {
    const result = [true, false, false, false];
    worldProgress.forEach((wp) => {
      const idx = (wp.world_id || wp.world?.id || 0) - 1;
      if (idx >= 0 && idx < 4) result[idx] = !!wp.is_unlocked;
    });
    return result;
  }

  function mapLevelUnlocks(levelProgress = [], field) {
    const result = [
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ];
    // Primeiro level de cada mundo começa desbloqueado
    result[0][0] = true; result[1][0] = true; result[2][0] = true; result[3][0] = true;

    levelProgress.forEach((lp) => {
      const levelId = lp.level_id || lp.level?.id;
      if (!levelId) return;
      const wi = Math.floor((levelId - 1) / 5);
      const li = (levelId - 1) % 5;
      if (wi < 4 && li < 5) result[wi][li] = !!lp[field];
    });
    return result;
  }

  function mapLevelStars(levelProgress = []) {
    const result = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    levelProgress.forEach((lp) => {
      const levelId = lp.level_id || lp.level?.id;
      if (!levelId) return;
      const wi = Math.floor((levelId - 1) / 5);
      const li = (levelId - 1) % 5;
      if (wi < 4 && li < 5) result[wi][li] = lp.best_stars || 0;
    });
    return result;
  }

  // -----------------------------------------------
  // Ações do jogo
  // -----------------------------------------------
  const updateSettings = useCallback((key, value) => {
    if (key === 'musicVolume' || key === 'sfxVolume') {
      if (!isValidVolume(value)) return;
    }
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const updateProfile = useCallback((key, value) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: value };
      return createProfile(updated);
    });
  }, [setProfile]);

  /**
   * Completa uma fase: atualiza localmente e sincroniza com o servidor
   */
  const completeLevelAction = useCallback(async (worldIndex, levelIndex, correct, total, avgTimeMs, creditMultiplier = 1, attemptId = null) => {
    // Processar localmente (imediato, para a UI não travar)
    const result = processLevelComplete(gameState, worldIndex, levelIndex, correct, total, avgTimeMs, creditMultiplier);
    setGameState(result.newState);

    // Sincronizar com o servidor em background
    if (isAuthenticated()) {
      try {
        const levelId = worldIndex * 5 + levelIndex + 1; // IDs de 1 a 20
        return await progressApi.completeLevel(
          levelId,
          correct,
          total,
          avgTimeMs,
          attemptId,
          creditMultiplier === 2,
        );
      } catch (err) {
        setGameState(gameState);
        if (err instanceof Error) throw err;
        console.warn('Falha ao salvar sessão no servidor:', err.message);
      }
    }

    return result;
  }, [gameState, setGameState]);

  const addCredits = useCallback((amount) => {
    setGameState((prev) => addCreditsModel(prev, amount));
  }, [setGameState]);

  const spendCredits = useCallback((amount) => {
    let success = false;
    setGameState((prev) => {
      const next = spendCreditsModel(prev, amount);
      if (next) { success = true; return next; }
      return prev;
    });
    return success;
  }, [setGameState]);

  const purchaseItem = useCallback((itemId, price, uses = 0) => {
    let success = false;
    setGameState((prev) => {
      const next = purchaseItemModel(prev, itemId, price, uses);
      if (next) { success = true; return next; }
      return prev;
    });
    return success;
  }, [setGameState]);

  const consumePowerUp = useCallback((itemId) => {
    let success = false;
    setGameState((prev) => {
      const next = consumePowerUpModel(prev, itemId);
      if (next) { success = true; return next; }
      return prev;
    });
    return success;
  }, [setGameState]);

  const equipSkin = useCallback((skinId) => {
    setGameState((prev) => equipSkinModel(prev, skinId));
    // Sincronizar equipamento com o servidor
    if (isAuthenticated()) {
      shopApi.equipSkin(skinId).catch((e) => console.warn('Falha ao equipar skin no servidor:', e.message));
    }
  }, [setGameState]);

  const loseLife = useCallback(() => {
    setGameState((prev) => loseLifeModel(prev));
  }, [setGameState]);

  const resetLives = useCallback(() => {
    setGameState((prev) => resetLivesModel(prev));
  }, [setGameState]);

  const resetAll = useCallback(() => {
    setGameState({ ...DEFAULT_GAME_STATE });
    setSettings({ ...DEFAULT_SETTINGS });
    setProfile(createProfile());
  }, [setGameState, setSettings, setProfile]);

  const handleLogin = useCallback((user) => {
    if (user) {
      setAuthUser(user);
      setIsOnline(true);
      syncFromServer();
    } else {
      // Modo guest
      setAuthUser(null);
      setIsOnline(false);
    }
  }, [setAuthUser, setIsOnline, syncFromServer]);

  const handleLogout = useCallback(() => {
    if (isAuthenticated()) {
      authApi.logout().catch(() => {});
    }
    clearAuth();
    localStorage.removeItem('mc_guest_mode');
    setAuthUser(null);
    setIsOnline(false);
  }, [setAuthUser, setIsOnline]);

  const value = {
    // Estado do jogo
    gameState,
    settings,
    profile,
    // Auth
    authUser,
    isOnline,
    handleLogin,
    handleLogout,
    syncFromServer,
    // Setters
    setGameState,
    setSettings,
    setProfile,
    // Ações
    updateSettings,
    updateProfile,
    completeLevelAction,
    addCredits,
    spendCredits,
    purchaseItem,
    consumePowerUp,
    equipSkin,
    loseLife,
    resetLives,
    resetAll,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState deve ser usado dentro de GameProvider');
  return ctx;
}
