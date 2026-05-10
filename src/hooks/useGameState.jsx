/**
 * Mental Calculations — useGameState Hook + Context Provider
 * Gerencia todo o estado global do jogo
 */
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { DEFAULT_GAME_STATE, DEFAULT_SETTINGS } from '../services/storageService';
import { processLevelComplete } from '../services/progressService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState] = useLocalStorage('mc_game_state', { ...DEFAULT_GAME_STATE });
  const [settings, setSettings] = useLocalStorage('mc_settings', { ...DEFAULT_SETTINGS });
  const [profile, setProfile] = useLocalStorage('mc_profile', { name: 'Jogador', avatar: '🧠', createdAt: new Date().toISOString() });

  // Garante que todas as propriedades existam (migração)
  useEffect(() => {
    const merged = { ...DEFAULT_GAME_STATE, ...gameState };
    if (JSON.stringify(merged) !== JSON.stringify(gameState)) {
      setGameState(merged);
    }
  }, []); // eslint-disable-line

  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const updateProfile = useCallback((key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  }, [setProfile]);

  const completeLevelAction = useCallback((worldIndex, levelIndex, correct, total, avgTimeMs) => {
    const result = processLevelComplete(gameState, worldIndex, levelIndex, correct, total, avgTimeMs);
    setGameState(result.newState);
    return result;
  }, [gameState, setGameState]);

  const addCredits = useCallback((amount) => {
    setGameState(prev => ({ ...prev, credits: prev.credits + amount }));
  }, [setGameState]);

  const spendCredits = useCallback((amount) => {
    if (gameState.credits < amount) return false;
    setGameState(prev => ({ ...prev, credits: prev.credits - amount }));
    return true;
  }, [gameState.credits, setGameState]);

  const purchaseItem = useCallback((itemId, price) => {
    if (gameState.credits < price) return false;
    if (gameState.purchasedItems.includes(itemId)) return false;
    setGameState(prev => ({
      ...prev,
      credits: prev.credits - price,
      purchasedItems: [...prev.purchasedItems, itemId],
    }));
    return true;
  }, [gameState, setGameState]);

  const equipSkin = useCallback((skinId) => {
    setGameState(prev => ({ ...prev, equippedSkin: skinId }));
  }, [setGameState]);

  const loseLife = useCallback(() => {
    setGameState(prev => ({ ...prev, lives: Math.max(0, prev.lives - 1) }));
  }, [setGameState]);

  const resetLives = useCallback(() => {
    setGameState(prev => ({ ...prev, lives: 3 }));
  }, [setGameState]);

  const resetAll = useCallback(() => {
    setGameState({ ...DEFAULT_GAME_STATE });
    setSettings({ ...DEFAULT_SETTINGS });
    setProfile({ name: 'Jogador', avatar: '🧠', createdAt: new Date().toISOString() });
  }, [setGameState, setSettings, setProfile]);

  const value = {
    gameState, settings, profile,
    setGameState, setSettings, setProfile,
    updateSettings, updateProfile,
    completeLevelAction, addCredits, spendCredits,
    purchaseItem, equipSkin,
    loseLife, resetLives, resetAll,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState deve ser usado dentro de GameProvider');
  return ctx;
}
