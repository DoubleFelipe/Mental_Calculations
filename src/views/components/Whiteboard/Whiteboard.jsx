import { useState } from 'react';
import CanvasDraft from './CanvasDraft.jsx';
import './Whiteboard.css';

const INITIAL_FIELDS = {
  a: '',
  b: '',
  c: '',
  deltaB: '',
  deltaA: '',
  deltaC: '',
  deltaValue: '',
  bhaskaraB: '',
  bhaskaraDelta: '',
  bhaskaraA: '',
  x1: '',
  x2: '',
};

export default function Whiteboard({ question }) {
  const [fields, setFields] = useState(() => ({ ...INITIAL_FIELDS, a: String(question.a), b: String(question.b), c: String(question.c) }));
  const [checked, setChecked] = useState(false);

  const updateField = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
    setChecked(false);
  };

  const readNumber = (value) => {
    const normalized = String(value).trim().replace(',', '.');
    return normalized === '' ? Number.NaN : Number(normalized);
  };
  const results = question.roots || [];
  const expectedRoots = results.length > 0 ? [results[0], results.length > 1 ? results[1] : results[0]] : [];
  const isFieldCorrect = (field, expected) => Number.isFinite(readNumber(fields[field])) && Math.abs(readNumber(fields[field]) - expected) < 0.01;
  const validation = checked ? {
    deltaValue: isFieldCorrect('deltaValue', question.delta),
    x1: expectedRoots.length > 0 && isFieldCorrect('x1', expectedRoots[0]),
    x2: expectedRoots.length > 0 && isFieldCorrect('x2', expectedRoots[1]),
  } : {};

  const clearBoard = () => {
    setFields(INITIAL_FIELDS);
  };

  return (
    <section className="whiteboard-root" aria-label="Quadro de resolução de Bhaskara">
      <div className="whiteboard-header">
        <div>
          <h3>Quadro de resolução</h3>
          <p>Os coeficientes foram preenchidos pela questão. Organize a conta e confira os resultados.</p>
        </div>
        <button className="chalk-btn whiteboard-clear" type="button" onClick={clearBoard} aria-label="Limpar os campos do cálculo">
          Limpar cálculo
        </button>
      </div>

      <div className="coefficient-grid" aria-label="Coeficientes da equacao">
        <label>
          <span>a</span>
          <input
            value={fields.a}
            onChange={(event) => updateField('a', event.target.value)}
            inputMode="decimal"
            placeholder="?"
          />
        </label>
        <label>
          <span>b</span>
          <input
            value={fields.b}
            onChange={(event) => updateField('b', event.target.value)}
            inputMode="decimal"
            placeholder="?"
          />
        </label>
        <label>
          <span>c</span>
          <input
            value={fields.c}
            onChange={(event) => updateField('c', event.target.value)}
            inputMode="decimal"
            placeholder="?"
          />
        </label>
      </div>

      <div className="formula-board">
        <div className="formula-card">
          <h4>Discriminante</h4>
          <div className="formula-row" aria-label="Δ igual a b ao quadrado menos quatro vezes a vezes c">
            <span>Δ =</span>
            <MathInput
              value={fields.deltaB}
              onChange={(value) => updateField('deltaB', value)}
              label="valor de b em b ao quadrado"
              placeholder="?"
            />
            <span className="sup">2</span>
            <span>− 4 ·</span>
            <MathInput
              value={fields.deltaA}
              onChange={(value) => updateField('deltaA', value)}
              label="valor de a no delta"
              placeholder="?"
            />
            <span>·</span>
            <MathInput
              value={fields.deltaC}
              onChange={(value) => updateField('deltaC', value)}
              label="valor de c no delta"
              placeholder="c"
            />
          </div>
          <div className="formula-row result-row">
            <span>Δ =</span>
            <MathInput
              validation={validation.deltaValue}
              value={fields.deltaValue}
              onChange={(value) => updateField('deltaValue', value)}
              label="valor encontrado para Δ"
              placeholder="?"
            />
          </div>
        </div>

        <div className="formula-card">
          <h4>Bhaskara</h4>
          <div className="fraction-formula">
            <div className="fraction-line fraction-top">
              <span>x =</span>
              <span>-</span>
              <MathInput
                value={fields.bhaskaraB}
                onChange={(value) => updateField('bhaskaraB', value)}
                label="valor de b na formula de Bhaskara"
              placeholder="?"
              />
              <span> ± √</span>
              <MathInput
                value={fields.bhaskaraDelta}
                onChange={(value) => updateField('bhaskaraDelta', value)}
                label="valor de Δ na fórmula de Bhaskara"
                placeholder="?"
              />
            </div>
            <div className="fraction-divider" />
            <div className="fraction-line fraction-bottom">
              <span>2 .</span>
              <MathInput
                value={fields.bhaskaraA}
                onChange={(value) => updateField('bhaskaraA', value)}
                label="valor de a no denominador"
                placeholder="a"
              />
            </div>
          </div>

          <div className="roots-grid">
            <label>
              <span>x1</span>
              <input
                className={checked ? (validation.x1 ? 'is-correct' : 'is-incorrect') : ''}
                value={fields.x1}
                onChange={(event) => updateField('x1', event.target.value)}
                inputMode="decimal"
                placeholder="?"
              />
            </label>
            <label>
              <span>x2</span>
              <input
                className={checked ? (validation.x2 ? 'is-correct' : 'is-incorrect') : ''}
                value={fields.x2}
                onChange={(event) => updateField('x2', event.target.value)}
                inputMode="decimal"
                placeholder="?"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="calculation-check">
        <button className="chalk-btn check-calculation" type="button" onClick={() => setChecked(true)}>Conferir cálculo</button>
        {checked && <div className="calculation-results" role="status" aria-live="polite">
          <p className={validation.deltaValue ? 'field-correct' : 'field-incorrect'}>{validation.deltaValue ? '✓' : '✗'} Δ {validation.deltaValue ? 'correto' : `incorreto — confira b² − 4·a·c (resultado: ${question.delta})`}</p>
          {expectedRoots.length > 0 && <>
            <p className={validation.x1 ? 'field-correct' : 'field-incorrect'}>{validation.x1 ? '✓' : '✗'} x₁ {validation.x1 ? 'correta' : `incorreta — confira (−b − √Δ)/(2a) (resultado: ${expectedRoots[0]})`}</p>
            <p className={validation.x2 ? 'field-correct' : 'field-incorrect'}>{validation.x2 ? '✓' : '✗'} x₂ {validation.x2 ? 'correta' : `incorreta — confira (−b + √Δ)/(2a) (resultado: ${expectedRoots[1]})`}</p>
          </>}
        </div>}
      </div>

      <CanvasDraft />
    </section>
  );
}

function MathInput({ value, onChange, label, placeholder, validation }) {
  return (
    <input
      className={`math-input ${validation === undefined ? '' : validation ? 'is-correct' : 'is-incorrect'}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode="decimal"
      aria-label={label}
      placeholder={placeholder}
    />
  );
}
