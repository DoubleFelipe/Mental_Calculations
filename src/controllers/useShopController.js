/**
 * Mental Calculations — Shop Controller
 * Controla as ações da loja, efeitos sonoros e mensagens de feedback.
 */
import { useState } from 'react';
import useGameState from './GameController';
import useAudio from '../hooks/useAudio';
import shopItems from '../data/shopItems';

export default function useShopController() {
  const { gameState, purchaseItem, equipSkin, addCredits, settings } = useGameState();
  const { playClick, playCoin } = useAudio(settings);
  const [tab, setTab] = useState('skin');
  const [message, setMessage] = useState('');

  const filteredItems = shopItems.filter(
    item => item.type === tab || (tab === 'credits' && item.type === 'credit_pack')
  );

  const handleBuy = (item) => {
    playClick();

    // Compra de pacotes de crédito (simulado)
    if (item.type === 'credit_pack') {
      playCoin();
      addCredits(item.credits);
      setMessage(`+${item.credits} créditos adicionados! (simulado)`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Se já possui o item
    if (gameState.purchasedItems.includes(item.id)) {
      if (item.type === 'skin') {
        equipSkin(item.id);
        setMessage(`Skin "${item.name}" equipada!`);
      } else {
        setMessage('Já comprado!');
      }
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Tentar comprar item
    const success = purchaseItem(item.id, item.price);
    if (success) {
      playCoin();
      setMessage(`"${item.name}" comprado!`);
      if (item.type === 'skin') {
        equipSkin(item.id);
      }
    } else {
      setMessage('Créditos insuficientes!');
    }
    setTimeout(() => setMessage(''), 2000);
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
  };
}
