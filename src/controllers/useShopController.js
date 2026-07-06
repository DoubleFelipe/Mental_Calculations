/**
 * Mental Calculations — Shop Controller
 * Usa a API do backend quando autenticado, fallback local caso contrário.
 */
import { useState } from 'react';
import useGameState from './GameController';
import useAudio from '../hooks/useAudio';
import shopItems from '../data/shopItems';
import { shopApi } from '../services/apiService';
import { isAuthenticated } from '../services/authService';

export default function useShopController() {
  const { gameState, purchaseItem, equipSkin, addCredits, settings, isOnline } = useGameState();
  const { playClick, playCoin } = useAudio(settings);
  const [tab, setTab] = useState('skin');
  const [message, setMessage] = useState('');

  const filteredItems = shopItems.filter(
    (item) => item.type === tab || (tab === 'credits' && item.type === 'credit_pack')
  );

  const showMessage = (msg, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const handleBuy = async (item) => {
    playClick();

    // ─── Pacote de créditos ───
    if (item.type === 'credit_pack') {
      if (isOnline && isAuthenticated()) {
        try {
          const result = await shopApi.buyItem(item.id);
          if (result.creditsAdded) {
            addCredits(result.creditsAdded);
            playCoin();
            showMessage(`+${result.creditsAdded} créditos adicionados!`, 3000);
          }
        } catch (err) {
          showMessage(err.message || 'Erro ao processar compra.');
        }
      } else {
        // Modo offline/guest: simular como antes
        playCoin();
        addCredits(item.credits);
        showMessage(`+${item.credits} créditos adicionados! (simulado)`, 3000);
      }
      return;
    }

    // ─── Item já possuído ───
    if (gameState.purchasedItems.includes(item.id)) {
      if (item.type === 'skin') {
        equipSkin(item.id);
        if (isOnline && isAuthenticated()) {
          shopApi.equipSkin(item.id).catch(() => {});
        }
        showMessage(`Skin "${item.name}" equipada!`);
      } else {
        showMessage('Já comprado!');
      }
      return;
    }

    // ─── Comprar item ───
    if (isOnline && isAuthenticated()) {
      try {
        await shopApi.buyItem(item.id);
        playCoin();
        // Atualizar estado local após compra confirmada pelo servidor
        purchaseItem(item.id, item.price);
        showMessage(`"${item.name}" comprado!`);
        if (item.type === 'skin') {
          equipSkin(item.id);
          shopApi.equipSkin(item.id).catch(() => {});
        }
      } catch (err) {
        showMessage(err.message || 'Erro ao comprar item.');
      }
    } else {
      // Modo offline/guest: lógica local original
      const success = purchaseItem(item.id, item.price);
      if (success) {
        playCoin();
        showMessage(`"${item.name}" comprado!`);
        if (item.type === 'skin') {
          equipSkin(item.id);
        }
      } else {
        showMessage('Créditos insuficientes!');
      }
    }
  };

  const changeTab = (newTab) => {
    playClick();
    setTab(newTab);
  };

  return {
    credits: gameState.credits,
    purchasedItems: gameState.purchasedItems,
    equippedSkin: gameState.equippedSkin,
    tab,
    changeTab,
    message,
    filteredItems,
    handleBuy,
    isOnline,
  };
}
