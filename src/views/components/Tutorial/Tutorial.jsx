import { useEffect, useId, useRef, useState } from 'react';
import { TUTORIALS } from '../../../data/tutorials';
import './Tutorial.css';

function LessonVisual({ type }) {
  if (type === 'coefficients') return (
    <div className="tutorial-coefficients" aria-label="a acompanha x ao quadrado, b acompanha x e c é o termo independente">
      <span><b>a</b>x²<small>coeficiente de x²</small></span><i>+</i>
      <span><b>b</b>x<small>coeficiente de x</small></span><i>+</i>
      <span><b>c</b><small>termo independente</small></span><i>= 0</i>
    </div>
  );
  if (type === 'delta') return (
    <div className="tutorial-delta" aria-label="Relação entre delta e raízes reais">
      <span><b>Δ &gt; 0</b><strong>● · ●</strong><small>duas distintas</small></span>
      <span><b>Δ = 0</b><strong>◉</strong><small>uma dupla</small></span>
      <span><b>Δ &lt; 0</b><strong>∅</strong><small>nenhuma real</small></span>
    </div>
  );
  if (type === 'rectangle') return (
    <svg className="tutorial-rectangle" viewBox="0 0 300 150" role="img" aria-label="Retângulo com largura x, comprimento x mais 2 e área 15 metros quadrados">
      <rect x="65" y="15" width="210" height="90" rx="4" />
      <text x="170" y="68" textAnchor="middle">Área = 15 m²</text>
      <text x="40" y="68" textAnchor="middle">x</text>
      <text x="170" y="135" textAnchor="middle">x + 2</text>
    </svg>
  );
  return null;
}

export default function Tutorial({ ids, review = false, onComplete, onClose }) {
  const steps = ids.flatMap((id) => [
    ...TUTORIALS[id].pages.map((item) => ({ ...item, id, kind: 'example' })),
    ...TUTORIALS[id].practice.map((item) => ({ ...item, id, kind: 'practice' })),
  ]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const titleRef = useRef(null);
  const titleId = useId();
  const step = steps[index];
  const answer = answers[index];
  const solved = answer === step.correct;
  const canAdvance = step.kind !== 'practice' || solved;

  useEffect(() => { titleRef.current?.focus(); }, [index]);

  return (
    <section className="tutorial" aria-labelledby={titleId}>
      <div className="tutorial-top"><span>NUMERIA · ESCOLA DA MESTRA ÁLGEBRA</span><button type="button" className="show-explanation-btn" onClick={onClose}>{review ? 'Fechar revisão' : 'Voltar à preparação'}</button></div>
      <p className="tutorial-guide">📐 <strong>Mestra Álgebra</strong> · {review ? 'Léo, vamos rever com calma. O tempo está pausado.' : 'Léo, vamos aprender e praticar antes do desafio. Aqui não há cronômetro nem perda de vidas.'}</p>
      {review && <label className="tutorial-picker">Consultar conteúdo
        <select value={step.id} onChange={(event) => setIndex(steps.findIndex((item) => item.id === event.target.value))}>
          {ids.map((id) => <option key={id} value={id}>{TUTORIALS[id].title}</option>)}
        </select>
      </label>}
      <div className="tutorial-progress"><span>{TUTORIALS[step.id].title}</span><span>Etapa {index + 1} de {steps.length}</span></div>
      <progress value={index + 1} max={steps.length} aria-label="Progresso da explicação" />
      <article className="tutorial-card" key={index}>
        <span className="tutorial-tag">{step.kind === 'practice' ? '✎ Sua vez · prática guiada' : '✦ Aprenda passo a passo'}</span>
        <h2 id={titleId} ref={titleRef} tabIndex={-1}>{step.title}</h2>
        {step.text && <p>{step.text}</p>}
        <LessonVisual type={step.visual} />
        {step.formula && <div className="tutorial-formula">{step.formula}</div>}
        {step.note && <p className="tutorial-note">💡 {step.note}</p>}
        {step.kind === 'practice' && (
          <fieldset className="tutorial-practice">
            <legend>{step.prompt}</legend>
            <div className="tutorial-options">{step.options.map((option, optionIndex) => (
              <button type="button" key={option} aria-pressed={answer === optionIndex} disabled={solved}
                className={`chalk-btn ${answer === optionIndex ? solved ? 'chalk-btn-green' : 'chalk-btn-red' : 'chalk-btn-blue'}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}>{option}</button>
            ))}</div>
            {answer !== undefined && <p className={`tutorial-response ${solved ? 'success' : 'retry'}`} role="status">
              <strong>{solved ? '✓ ' : '↻ Vamos tentar de novo. '}</strong>{step.feedback[answer]}
            </p>}
            {!solved && <p className="tutorial-practice-note">Escolha uma resposta para continuar. Você pode tentar quantas vezes precisar.</p>}
          </fieldset>
        )}
      </article>
      <div className="tutorial-actions">
        <button type="button" className="chalk-btn chalk-btn-blue" disabled={index === 0} onClick={() => setIndex((prev) => prev - 1)}>← Voltar</button>
        <button type="button" className="chalk-btn chalk-btn-green" disabled={!canAdvance} onClick={() => index + 1 < steps.length ? setIndex((prev) => prev + 1) : onComplete()}>
          {index + 1 < steps.length ? 'Próximo →' : review ? 'Entendi · voltar à fase' : 'Entendi · preparação concluída ✓'}
        </button>
      </div>
    </section>
  );
}
