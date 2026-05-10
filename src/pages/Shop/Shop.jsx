/**
 * Mental Calculations — Loja
 */
import React, { useState } from 'react';
import useGameState from '../../hooks/useGameState';
import useAudio from '../../hooks/useAudio';
import shopItems from '../../data/shopItems';
import './Shop.css';

export default function Shop({ onNavigate }) {
  const { gameState, purchaseItem, equipSkin, addCredits, settings } = useGameState();
  const { playClick, playCoin } = useAudio(settings);
  const [tab, setTab] = useState('skin');
  const [message, setMessage] = useState('');

  const filtered = shopItems.filter(item => item.type === tab || (tab === 'credits' && item.type === 'credit_pack'));
  const tabLabel = tab === 'skin' ? 'Skins' : tab === 'powerup' ? 'Power-ups' : 'Créditos';

  const handleBuy = (item) => {
    playClick();
    if (item.type === 'credit_pack') {
      playCoin();
      addCredits(item.credits);
      setMessage(`+${item.credits} créditos adicionados! (simulado)`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (gameState.purchasedItems.includes(item.id)) {
      if (item.type === 'skin') { equipSkin(item.id); setMessage(`Skin "${item.name}" equipada!`); }
      else setMessage('Já comprado!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const success = purchaseItem(item.id, item.price);
    if (success) {
      playCoin();
      setMessage(`"${item.name}" comprado!`);
      if (item.type === 'skin') equipSkin(item.id);
    } else {
      setMessage('Créditos insuficientes!');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="shop-page chalkboard chalkboard-frame animate-fadeIn">
      <h2 className="chalk-text-strong shop-title">🛒 Loja</h2>
      <div className="shop-balance">💰 {gameState.credits} créditos</div>

      <div className="shop-tabs">
        {['skin', 'powerup', 'credits'].map(t => (
          <button key={t} className={`shop-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); playClick(); }}>
            {t === 'skin' ? '👕 Skins' : t === 'powerup' ? '⚡ Power-ups' : '💎 Créditos'}
          </button>
        ))}
      </div>

      {message && <div className="shop-message animate-popIn">{message}</div>}

      <div className="shop-grid">
        {filtered.map(item => {
          const owned = gameState.purchasedItems.includes(item.id);
          const equipped = gameState.equippedSkin === item.id;
          return (
            <div key={item.id} className={`shop-item chalk-card animate-fadeInUp ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`}>
              <span className="shop-item-icon">{item.icon}</span>
              <span className="shop-item-name">{item.name}</span>
              <span className="shop-item-desc">{item.description}</span>
              {item.type === 'credit_pack' ? (
                <button className="chalk-btn chalk-btn-yellow shop-buy-btn" onClick={() => handleBuy(item)}>
                  {item.realPrice} (simulado)
                </button>
              ) : (
                <button className={`chalk-btn ${owned ? 'chalk-btn-green' : 'chalk-btn-blue'} shop-buy-btn`}
                  onClick={() => handleBuy(item)}>
                  {equipped ? '✅ Equipado' : owned ? 'Equipar' : `💰 ${item.price}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
