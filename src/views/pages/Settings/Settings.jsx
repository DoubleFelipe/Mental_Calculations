/**
 * Mental Calculations — Configurações
 */
import useGameState from '../../../controllers/GameController';
import useAudio from '../../../hooks/useAudio';
import { DEFAULT_SETTINGS, DIFFICULTY_OPTIONS } from '../../../models/SettingsModel';
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
          <label className="chalk-text" htmlFor="double-jump-toggle">Ativar pulo duplo:</label>
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

        <fieldset className="setting-row difficulty-setting animate-fadeInLeft stagger-4">
          <legend className="chalk-text">Dificuldade:</legend>
          <div className="difficulty-options">
            {DIFFICULTY_OPTIONS.map((option) => (
              <label className="difficulty-option" key={option.value}>
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={(settings.difficulty ?? DEFAULT_SETTINGS.difficulty) === option.value}
                  onChange={(event) => updateSettings('difficulty', event.target.value)}
                />
                <span>{option.label}</span>
                <small>{option.timeLimit}s</small>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="setting-row animate-fadeInLeft stagger-5">
          <label className="chalk-text">🌐 Linguagem:</label>
          <span className="setting-value-text">pt-br</span>
        </div>

        <div className="setting-row animate-fadeInLeft stagger-6">
          <label className="chalk-text">📐 Resolução:</label>
          <span className="setting-value-text">{window.innerWidth}x{window.innerHeight}</span>
        </div>
      </div>

      <div className="settings-actions">
        <button className="chalk-btn chalk-btn-red reset-btn" onClick={() => {
          if (window.confirm('Tem certeza? Isso vai apagar todo o progresso!')) resetAll();
        }}>
          🗑️ Resetar Progresso
        </button>
      </div>

      <button className="chalk-arrow-btn back-btn" onClick={() => onNavigate('mainMenu')}>← Voltar</button>
    </div>
  );
}
