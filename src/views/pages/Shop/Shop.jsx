/**
 * Mental Calculations — Loja (View)
 */
import React from 'react';
import useShopController from '../../../controllers/useShopController';
import './Shop.css';

export default function Shop({ onNavigate }) {
  const {
    credits,
    purchasedItems,
    equippedSkin,
    tab,
    changeTab,
    message,
    filteredItems,
    handleBuy,
  } = useShopController();

  return (
    <div className="shop-page chalkboard chalkboard-frame animate-fadeIn">
      <h2 className="chalk-text-strong shop-title">🛒 Loja</h2>
      <div className="shop-balance">💰 {credits} créditos</div>

      <div className="shop-tabs">
        {['skin', 'powerup', 'credits'].map(t => (
          <button key={t} className={`shop-tab ${tab === t ? 'active' : ''}`} onClick={() => changeTab(t)}>
            {t === 'skin' ? '👕 Skins' : t === 'powerup' ? '⚡ Power-ups' : '💎 Créditos'}
          </button>
        ))}
      </div>

      {message && <div className="shop-message animate-popIn">{message}</div>}

      <div className="shop-grid">
        {filteredItems.map(item => {
          const owned = purchasedItems.includes(item.id);
          const equipped = equippedSkin === item.id;
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
