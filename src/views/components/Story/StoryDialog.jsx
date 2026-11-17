import { useEffect, useId, useRef, useState } from 'react';
import useGameState from '../../../controllers/GameController';
import { FRAGMENTS } from '../../../data/story';
import { getPendingStoryEvents, getStoryPlayerKey, getStoryProgress } from '../../../models/StoryModel';
import './Story.css';

const PORTRAITS = { 'Léo': '🧭', 'Mestra Álgebra': '📐', 'Zero Absoluto': '∅', 'Guardião': '△' };
const SHARDS = ['0,0 50,0 50,36 26,42', '50,0 100,0 74,42 50,36', '0,0 26,42 0,62', '26,42 50,36 50,70 24,80 0,62', '50,36 74,42 100,62 76,80 50,70', '74,42 100,0 100,62', '24,80 50,70 76,80 50,106'];

export function StoryHeart({ fragments = [], compact = false }) {
  const clipId = useId();
  return (
    <div className={`story-heart ${compact ? 'story-heart-compact' : ''}`}>
      <svg viewBox="0 0 100 110" role="img" aria-label={`Coração dos Cálculos: ${fragments.length} de 7 fragmentos`}>
        <defs><clipPath id={clipId}><path d="M50 17 C17 -13 -16 21 9 51 L50 102 L91 51 C116 21 83 -13 50 17Z" /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          {FRAGMENTS.map((fragment, index) => <polygon key={fragment.id} points={SHARDS[index]} className={fragments.some((item) => item.id === fragment.id) ? 'recovered' : ''} />)}
        </g>
      </svg>
      <span>{fragments.length}/7 <span className="story-heart-label">fragmentos</span></span>
    </div>
  );
}

// One reusable, player-paced dialogue for introductions, existing NPCs and milestones.
export function StoryDialog({ scenes, onComplete, onCancel, finishLabel = 'Continuar aventura', fragments = [], skippable = true }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const titleId = useId();
  const scene = scenes[index];
  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (onCancel) onCancel();
      else if (skippable) onComplete();
    }
    if (event.key === 'Tab') {
      const buttons = [...dialogRef.current.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) { event.preventDefault(); first?.focus(); }
    }
  };
  return (
    <div className="story-overlay">
      <section ref={dialogRef} className="story-dialog chalkboard chalkboard-frame" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={handleKeyDown}>
        <div className="story-dialog-top"><span>NUMERIA · {index + 1}/{scenes.length}</span>{skippable && <button type="button" className="story-skip" onClick={onComplete}>Pular diálogo</button>}</div>
        <StoryHeart fragments={fragments} />
        <div className="story-scene animate-fadeIn" key={index} aria-live="polite" aria-atomic="true">
          <div className={`story-portrait ${scene.speaker === 'Zero Absoluto' ? 'story-villain' : ''}`} aria-hidden="true">{PORTRAITS[scene.speaker] || '△'}</div>
          <p className="story-speaker">{scene.speaker}</p>
          <h2 id={titleId}>{scene.title}</h2>
          <p className="story-text">{scene.text}</p>
        </div>
        <div className="story-actions">
          {onCancel && <button className="chalk-btn chalk-btn-blue" onClick={onCancel}>Voltar ao mapa</button>}
          <button className="chalk-btn chalk-btn-green" onClick={() => index + 1 < scenes.length ? setIndex(index + 1) : onComplete()}>{index + 1 < scenes.length ? 'Próximo →' : finishLabel}</button>
        </div>
      </section>
    </div>
  );
}

export function StoryEvents({ intro = false, worldIndex }) {
  const { gameState, authUser, markNarrativeEvent } = useGameState();
  const event = getPendingStoryEvents(gameState, getStoryPlayerKey(authUser), { intro, worldIndex })[0];
  if (!event) return null;
  return <StoryDialog key={event.id} scenes={event.scenes} fragments={getStoryProgress(gameState).fragments} onComplete={() => markNarrativeEvent(event.id)} finishLabel={event.id === 'ending' ? 'Por Numeria! →' : 'Continuar aventura →'} skippable={event.id !== 'ending'} />;
}
