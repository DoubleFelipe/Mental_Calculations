import { useState } from 'react';
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

export default function Whiteboard() {
  const [fields, setFields] = useState(INITIAL_FIELDS);

  const updateField = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const clearBoard = () => {
    setFields(INITIAL_FIELDS);
  };

  return (
    <section className="whiteboard-root" aria-label="Quadro de apoio para Delta e Bhaskara">
      <div className="whiteboard-header">
        <div>
          <h3>Quadro de Bhaskara</h3>
          <p>Preencha os valores para organizar sua conta.</p>
        </div>
        <button className="chalk-btn whiteboard-clear" type="button" onClick={clearBoard}>
          Limpar
        </button>
      </div>

      <div className="coefficient-grid" aria-label="Coeficientes da equacao">
        <label>
          <span>a</span>
          <input
            value={fields.a}
            onChange={(event) => updateField('a', event.target.value)}
            inputMode="decimal"
            placeholder="a"
          />
        </label>
        <label>
          <span>b</span>
          <input
            value={fields.b}
            onChange={(event) => updateField('b', event.target.value)}
            inputMode="decimal"
            placeholder="b"
          />
        </label>
        <label>
          <span>c</span>
          <input
            value={fields.c}
            onChange={(event) => updateField('c', event.target.value)}
            inputMode="decimal"
            placeholder="c"
          />
        </label>
      </div>

      <div className="formula-board">
        <div className="formula-card">
          <h4>Delta</h4>
          <div className="formula-row">
            <span>Delta =</span>
            <MathInput
              value={fields.deltaB}
              onChange={(value) => updateField('deltaB', value)}
              label="valor de b em b ao quadrado"
              placeholder="b"
            />
            <span className="sup">2</span>
            <span>- 4 .</span>
            <MathInput
              value={fields.deltaA}
              onChange={(value) => updateField('deltaA', value)}
              label="valor de a no delta"
              placeholder="a"
            />
            <span>.</span>
            <MathInput
              value={fields.deltaC}
              onChange={(value) => updateField('deltaC', value)}
              label="valor de c no delta"
              placeholder="c"
            />
          </div>
          <div className="formula-row result-row">
            <span>Delta =</span>
            <MathInput
              value={fields.deltaValue}
              onChange={(value) => updateField('deltaValue', value)}
              label="valor encontrado para delta"
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
                placeholder="b"
              />
              <span> +/- raiz de</span>
              <MathInput
                value={fields.bhaskaraDelta}
                onChange={(value) => updateField('bhaskaraDelta', value)}
                label="valor de delta na formula de Bhaskara"
                placeholder="Delta"
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
                value={fields.x1}
                onChange={(event) => updateField('x1', event.target.value)}
                inputMode="decimal"
                placeholder="?"
              />
            </label>
            <label>
              <span>x2</span>
              <input
                value={fields.x2}
                onChange={(event) => updateField('x2', event.target.value)}
                inputMode="decimal"
                placeholder="?"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

function MathInput({ value, onChange, label, placeholder }) {
  return (
    <input
      className="math-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode="decimal"
      aria-label={label}
      placeholder={placeholder}
    />
  );
}
