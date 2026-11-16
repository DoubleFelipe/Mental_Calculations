import { useEffect, useRef, useState } from 'react';
import { INTRO, ENDING } from '../../../data/story';
import './Story.css';
export default function Cinematic({ ending = false, onFinish }) {
  const [step, setStep] = useState(0);
  const buttonRef = useRef(null);
  const scenes = ending ? ENDING : INTRO;
  const [speaker, title, text] = scenes[step];
  const broken = !ending && step >= 3;
  useEffect(() => { buttonRef.current?.focus({preventScroll:true}); }, [step]);
  return <main className={`numeria-cinema ${broken ? 'broken' : ''} ${ending ? 'restored' : ''}`}>
    <header><span>MENTAL CALCULATIONS / NUMERIA</span><button className="story-link" onClick={onFinish}>{ending ? 'Ver conquista' : 'Pular introdução'} ↗</button></header>
    <div className="cinema-scene" aria-hidden="true">
      <div className="cinema-moon"/><div className="cinema-mountains"/>
      <div className="cinema-temple"><i/><i/><i/><div className="cinema-relic">{Array.from({length:7},(_,i)=><b key={i} style={{'--i':i}}>◆</b>)}</div></div>
      {(!ending && step === 2) && <div className="cinema-zero">∅</div>}
      <div className="cinema-leo">♙<span>Léo</span></div>
      <div className="cinema-river"/>
      <div className="cinema-runes">+ &nbsp; × &nbsp; ½ &nbsp; x &nbsp; △</div>
    </div>
    <section className="cinema-caption" key={step} aria-live="polite">
      <p className="story-eyebrow">{ending ? 'EPÍLOGO' : 'A LENDA DOS NÚMEROS PERDIDOS'} · {step+1}/{scenes.length}</p>
      <h1>{title}</h1><strong>{speaker}</strong><p>{text}</p>
      <button ref={buttonRef} className="chalk-btn chalk-btn-green" onClick={()=>step+1 < scenes.length ? setStep(step+1) : onFinish()}>{step+1 === scenes.length ? ending ? 'Receber o título →' : 'Entrar em Numeria →' : 'Continuar →'}</button>
    </section>
  </main>;
}
