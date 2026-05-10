/**
 * Mental Calculations — Audio Service
 * Gerencia efeitos sonoros e música usando Web Audio API
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.musicVolume = 0.8;
    this.sfxVolume = 0.5;
    this.musicOsc = null;
    this.musicGain = null;
    this.isMusicPlaying = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMusicVolume(vol) { this.musicVolume = vol / 100; if (this.musicGain) this.musicGain.gain.value = this.musicVolume * 0.15; }
  setSfxVolume(vol) { this.sfxVolume = vol / 100; }

  /** Toca uma nota curta como efeito sonoro */
  playNote(freq, duration = 0.15, type = 'square', vol = 1) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = this.sfxVolume * vol * 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { /* silencioso */ }
  }

  /** Efeito de acerto */
  playCorrect() {
    this.playNote(523, 0.1, 'square');
    setTimeout(() => this.playNote(659, 0.1, 'square'), 100);
    setTimeout(() => this.playNote(784, 0.2, 'square'), 200);
  }

  /** Efeito de erro */
  playWrong() {
    this.playNote(200, 0.15, 'sawtooth');
    setTimeout(() => this.playNote(150, 0.3, 'sawtooth'), 150);
  }

  /** Efeito de moeda */
  playCoin() {
    this.playNote(988, 0.08, 'square');
    setTimeout(() => this.playNote(1319, 0.15, 'square'), 80);
  }

  /** Efeito de pulo */
  playJump() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
      gain.gain.value = this.sfxVolume * 0.15;
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) { /* silencioso */ }
  }

  /** Efeito de clique */
  playClick() { this.playNote(800, 0.05, 'sine', 0.5); }

  /** Música de fundo simples (loop de oscilador) */
  startMusic() {
    if (!this.ctx || this.isMusicPlaying) return;
    try {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume * 0.15;
      this.musicGain.connect(this.ctx.destination);

      const notes = [262, 294, 330, 349, 392, 440, 392, 349];
      let noteIndex = 0;

      const playNext = () => {
        if (!this.isMusicPlaying) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIndex % notes.length];
        const noteGain = this.ctx.createGain();
        noteGain.gain.value = 1;
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        osc.connect(noteGain);
        noteGain.connect(this.musicGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
        noteIndex++;
        this.musicTimeout = setTimeout(playNext, 800);
      };

      this.isMusicPlaying = true;
      playNext();
    } catch (e) { /* silencioso */ }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeout) clearTimeout(this.musicTimeout);
  }

  /** Efeito de vitória */
  playVictory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => this.playNote(n, 0.3, 'square'), i * 200));
  }

  /** Efeito de derrota */
  playDefeat() {
    const notes = [400, 350, 300, 200];
    notes.forEach((n, i) => setTimeout(() => this.playNote(n, 0.3, 'sawtooth', 0.7), i * 250));
  }
}

// Singleton
const audioService = new AudioService();
export default audioService;
