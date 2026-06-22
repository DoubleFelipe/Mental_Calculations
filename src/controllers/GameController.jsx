/**
 * Mental Calculations — Game Controller
 * Gerencia o estado reativo da aplicação e atua como intermediário entre
 * as views e os modelos (persistência e lógica pura).
 */
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  DEFAULT_GAME_STATE,
  processLevelComplete,
  addCredits as addCreditsModel,
  spendCredits as spendCreditsModel,
  purchaseItem as purchaseItemModel,
  equipSkin as equipSkinModel,
  loseLife as loseLifeModel,
  resetLives as resetLivesModel
} from '../models/GameModel';
import { DEFAULT_SETTINGS, isValidVolume } from '../models/SettingsModel';
import { DEFAULT_PROFILE, createProfile } from '../models/ProfileModel';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useLocalStorage('mc_game_state', { ...DEFAULT_GAME_STATE });
  const [settings, setSettings] = useLocalStorage('mc_settings', { ...DEFAULT_SETTINGS });
  const [profile, setProfile] = useLocalStorage('mc_profile', createProfile());

  // Garante integridade do estado em migrações
  useEffect(() => {
    const merged = { ...DEFAULT_GAME_STATE, ...gameState };
    if (JSON.stringify(merged) !== JSON.stringify(gameState)) {
      setGameState(merged);
    }
  }, []); // eslint-disable-line

  const updateSettings = useCallback((key, value) => {
    if (key === 'musicVolume' || key === 'sfxVolume') {
      if (!isValidVolume(value)) return;
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const updateProfile = useCallback((key, value) => {
    setProfile(prev => {
      const updated = { ...prev, [key]: value };
      return createProfile(updated);
    });
  }, [setProfile]);

  const completeLevelAction = useCallback((worldIndex, levelIndex, correct, total, avgTimeMs) => {
    const result = processLevelComplete(gameState, worldIndex, levelIndex, correct, total, avgTimeMs);
    setGameState(result.newState);
    return result;
  }, [gameState, setGameState]);

  const addCredits = useCallback((amount) => {
    setGameState(prev => addCreditsModel(prev, amount));
  }, [setGameState]);

  const spendCredits = useCallback((amount) => {
    let success = false;
    setGameState(prev => {
      const next = spendCreditsModel(prev, amount);
      if (next) {
        success = true;
        return next;
      }
      return prev;
    });
    return success;
  }, [setGameState]);

  const purchaseItem = useCallback((itemId, price) => {
    let success = false;
    setGameState(prev => {
      const next = purchaseItemModel(prev, itemId, price);
      if (next) {
        success = true;
        return next;
      }
      return prev;
    });
    return success;
  }, [setGameState]);

  const equipSkin = useCallback((skinId) => {
    setGameState(prev => equipSkinModel(prev, skinId));
  }, [setGameState]);

  const loseLife = useCallback(() => {
    setGameState(prev => loseLifeModel(prev));
  }, [setGameState]);

  const resetLives = useCallback(() => {
    setGameState(prev => resetLivesModel(prev));
  }, [setGameState]);

  const resetAll = useCallback(() => {
    setGameState({ ...DEFAULT_GAME_STATE });
    setSettings({ ...DEFAULT_SETTINGS });
    setProfile(createProfile());
  }, [setGameState, setSettings, setProfile]);

  const value = {
    gameState,
    settings,
    profile,
    setGameState,
    setSettings,
    setProfile,
    updateSettings,
    updateProfile,
    completeLevelAction,
    addCredits,
    spendCredits,
    purchaseItem,
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
