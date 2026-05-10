/**
 * Mental Calculations — Tela Inicial (Main Menu)
 * Design: lousa verde com fórmulas decorativas e botões coloridos
 */
import React, { useEffect, useState } from 'react';
import useAudio from '../../hooks/useAudio';
import './MainMenu.css';

const FORMULAS = [
  { text: 'x² + 5x + 6 = 0', x: '5%', y: '15%', rot: '-12deg' },
  { text: 'Δ = b² - 4ac', x: '75%', y: '10%', rot: '8deg' },
  { text: '3x² - 7 = 0', x: '10%', y: '75%', rot: '5deg' },
  { text: 'E = mc²', x: '80%', y: '80%', rot: '-6deg' },
  { text: 'x = -b ± √Δ / 2a', x: '60%', y: '85%', rot: '3deg' },
  { text: '2x² + 3x - 5 = 0', x: '85%', y: '45%', rot: '-10deg' },
  { text: 'S = -b/a', x: '5%', y: '50%', rot: '7deg' },
  { text: 'P = c/a', x: '15%', y: '88%', rot: '-4deg' },
  { text: 'π ≈ 3,14', x: '90%', y: '20%', rot: '12deg' },
  { text: '√9 = 3', x: '3%', y: '35%', rot: '-8deg' },
];

export default function MainMenu({ onNavigate }) {
  const [visible, setVisible] = useState(false);
  const { initAudio, playClick, startMusic } = useAudio();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleClick = (page) => {
    initAudio();
    playClick();
    onNavigate(page);
  };

  const handlePlay = () => {
    initAudio();
    playClick();
    startMusic();
    onNavigate('worldSelect');
  };

  return (
    <div className={`main-menu chalkboard chalkboard-frame ${visible ? 'animate-fadeIn' : ''}`}>
      {/* Fórmulas decorativas no fundo */}
      <div className="chalk-formulas">
        {FORMULAS.map((f, i) => (
          <span key={i} className="chalk-formula-item" style={{ left: f.x, top: f.y, '--rotation': f.rot }}>{f.text}</span>
        ))}
      </div>

      <div className="menu-content">
        {/* Logo */}
        <div className="menu-logo animate-bounceIn">
          <div className="brain-icon">🧠</div>
          <h1 className="menu-title chalk-text-strong">Mental</h1>
          <h1 className="menu-title-highlight">Calculations</h1>
        </div>

        {/* Botões */}
        <div className="menu-buttons">
          <button className="chalk-btn chalk-btn-green stagger-1 animate-fadeInUp" onClick={handlePlay}>
            ▶ Jogar
          </button>
          <button className="chalk-btn chalk-btn-blue stagger-2 animate-fadeInUp" onClick={() => handleClick('profile')}>
            👤 Perfil
          </button>
          <button className="chalk-btn chalk-btn-yellow stagger-3 animate-fadeInUp" onClick={() => handleClick('shop')}>
            🛒 Loja
          </button>
          <button className="chalk-btn chalk-btn-purple stagger-4 animate-fadeInUp" onClick={() => handleClick('settings')}>
            ⚙️ Configurações
          </button>
          <button className="chalk-btn chalk-btn-red stagger-5 animate-fadeInUp" onClick={() => handleClick('exit')}>
            🚪 Sair
          </button>
        </div>
      </div>
    </div>
  );
}
