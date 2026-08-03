/**
 * Mental Calculations — Configurações
 */
import useGameState from '../../../controllers/GameController';
import useAudio from '../../../hooks/useAudio';
import './Settings.css';

export default function Settings({ onNavigate }) {
  const { settings, updateSettings, resetAll } = useGameState();
  const { initAudio } = useAudio(settings);

  const handleVolumeChange = (key, value) => {
    initAudio();
    updateSettings(key, parseInt(value));
  };

  return (
    <div className="settings-page chalkboard chalkboard-frame animate-fadeIn">
      <h2 className="chalk-text-strong settings-title">⚙️ Configurações</h2>

      <div className="settings-list">
        <div className="setting-row animate-fadeInLeft stagger-1">
          <label className="chalk-text">🎵 Música:</label>
          <div className="slider-group">
            <span>-</span>
            <input type="range" className="chalk-slider" min="0" max="100"
              value={settings.musicVolume}
              onChange={(e) => handleVolumeChange('musicVolume', e.target.value)} />
            <span>+</span>
          </div>
          <span className="setting-value">{settings.musicVolume}%</span>
        </div>

        <div className="setting-row animate-fadeInLeft stagger-2">
          <label className="chalk-text">🔊 Volume:</label>
          <div className="slider-group">
            <span>-</span>
            <input type="range" className="chalk-slider" min="0" max="100"
              value={settings.sfxVolume}
              onChange={(e) => handleVolumeChange('sfxVolume', e.target.value)} />
            <span>+</span>
          </div>
          <span className="setting-value">{settings.sfxVolume}%</span>
        </div>

        <div className="setting-row setting-toggle-row animate-fadeInLeft stagger-3">
          <label className="chalk-text" htmlFor="double-jump-toggle">Pulo duplo:</label>
          <label className="switch-control">
            <input
              id="double-jump-toggle"
              type="checkbox"
              checked={Boolean(settings.doubleJump)}
              onChange={(e) => updateSettings('doubleJump', e.target.checked)}
            />
            <span className="switch-slider" aria-hidden="true" />
          </label>
          <span className="setting-value-text">{settings.doubleJump ? 'Ativado' : 'Desativado'}</span>
        </div>

        <div className="setting-row animate-fadeInLeft stagger-4">
          <label className="chalk-text">🌐 Linguagem:</label>
          <span className="setting-value-text">pt-br</span>
        </div>

        <div className="setting-row animate-fadeInLeft stagger-5">
          <label className="chalk-text">📐 Resolução:</label>
          <span className="setting-value-text">{window.innerWidth}x{window.innerHeight}</span>
        </div>
      </div>

      <button className="chalk-btn chalk-btn-red reset-btn" onClick={() => {
        if (window.confirm('Tem certeza? Isso vai apagar todo o progresso!')) resetAll();
      }}>
        🗑️ Resetar Progresso
      </button>

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
