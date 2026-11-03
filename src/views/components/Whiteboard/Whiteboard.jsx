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

export default function Whiteboard({ question = null }) {
  const [fields, setFields] = useState(INITIAL_FIELDS);

  // Auto-preencher se a questão tiver coeficientes definidos
  const handleLoadFromQuestion = () => {
    if (!question) return;
    const aVal = question.a !== undefined ? String(question.a) : '1';
    const bVal = question.b !== undefined ? String(question.b) : '0';
    const cVal = question.c !== undefined ? String(question.c) : '0';
    const deltaVal = question.delta !== undefined ? String(question.delta) : '';

    setFields({
      a: aVal,
      b: bVal,
      c: cVal,
      deltaB: bVal,
      deltaA: aVal,
      deltaC: cVal,
      deltaValue: deltaVal,
      bhaskaraB: bVal,
      bhaskaraDelta: deltaVal,
      bhaskaraA: aVal,
      x1: question.roots?.[0] !== undefined ? String(question.roots[0]) : '',
      x2: question.roots?.[1] !== undefined ? String(question.roots[1]) : '',
    });
  };

  const updateField = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const clearBoard = () => {
    setFields(INITIAL_FIELDS);
  };

  const aNum = parseFloat(fields.a);
  const bNum = parseFloat(fields.b);
  const cNum = parseFloat(fields.c);
  const hasValidCoeffs = !isNaN(aNum) && !isNaN(bNum) && !isNaN(cNum);
  const calcDelta = hasValidCoeffs ? (bNum * bNum - 4 * aNum * cNum) : null;
  const sqrtDelta = calcDelta !== null && calcDelta >= 0 ? Math.sqrt(calcDelta) : null;

  return (
    <section className="whiteboard-root" aria-label="Quadro de apoio para Delta e Bhaskara">
      <div className="whiteboard-header">
        <div>
          <h3>📐 Quadro de Apoio ao Cálculo</h3>
          <p>Organize suas contas passo a passo sem perder tempo.</p>
        </div>
        <div className="whiteboard-actions">
          {question && (question.a !== undefined || question.text) && (
            <button
              className="chalk-btn whiteboard-load-btn"
              type="button"
              onClick={handleLoadFromQuestion}
              title="Preenche a, b e c da questão atual automaticamente"
            >
              ⚡ Usar dados da questão
            </button>
          )}
          <button className="chalk-btn whiteboard-clear" type="button" onClick={clearBoard}>
            Limpar
          </button>
        </div>
      </div>

      {question?.mentalTip && (
        <div className="whiteboard-tip-banner">
          <span className="tip-icon">💡</span>
          <span><strong>Dica de cálculo mental:</strong> {question.mentalTip}</span>
        </div>
      )}

      <div className="coefficient-section">
        <span className="section-label">1. Coeficientes (ax² + bx + c = 0):</span>
        <div className="coefficient-grid" aria-label="Coeficientes da equacao">
          <label>
            <span>a</span>
            <input
              value={fields.a}
              onChange={(event) => updateField('a', event.target.value)}
              inputMode="decimal"
              placeholder="Ex: 1"
            />
          </label>
          <label>
            <span>b</span>
            <input
              value={fields.b}
              onChange={(event) => updateField('b', event.target.value)}
              inputMode="decimal"
              placeholder="Ex: -5"
            />
          </label>
          <label>
            <span>c</span>
            <input
              value={fields.c}
              onChange={(event) => updateField('c', event.target.value)}
              inputMode="decimal"
              placeholder="Ex: 6"
            />
          </label>
        </div>
      </div>

      <div className="formula-board">
        {/* Card do Delta */}
        <div className="formula-card">
          <div className="formula-card-header">
            <h4>2. Discriminante (Δ = b² - 4ac)</h4>
          </div>
          <div className="formula-row">
            <span>Δ =</span>
            <MathInput
              value={fields.deltaB}
              onChange={(value) => updateField('deltaB', value)}
              label="valor de b em b ao quadrado"
              placeholder="b"
            />
            <span className="sup">2</span>
            <span>- 4 ·</span>
            <MathInput
              value={fields.deltaA}
              onChange={(value) => updateField('deltaA', value)}
              label="valor de a no delta"
              placeholder="a"
            />
            <span>·</span>
            <MathInput
              value={fields.deltaC}
              onChange={(value) => updateField('deltaC', value)}
              label="valor de c no delta"
              placeholder="c"
            />
          </div>

          {hasValidCoeffs && (
            <div className="calc-steps-box animate-fadeIn">
              <span className="calc-step-line">
                Δ = ({bNum})² - 4·({aNum})·({cNum})
              </span>
              <span className="calc-step-line">
                Δ = {bNum * bNum} {(-4 * aNum * cNum) >= 0 ? `+ ${-4 * aNum * cNum}` : `- ${Math.abs(-4 * aNum * cNum)}`} = <strong>{calcDelta}</strong>
              </span>
              {calcDelta !== null && (
                <span className={`calc-nature-badge ${calcDelta > 0 ? 'nature-pos' : calcDelta === 0 ? 'nature-zero' : 'nature-neg'}`}>
                  {calcDelta > 0 && `Δ > 0 ➔ 2 raízes reais distintas (√Δ = ${sqrtDelta !== null && Number.isInteger(sqrtDelta) ? sqrtDelta : sqrtDelta?.toFixed(2)})`}
                  {calcDelta === 0 && `Δ = 0 ➔ 1 raiz real dupla`}
                  {calcDelta < 0 && `Δ < 0 ➔ Sem raízes reais`}
                </span>
              )}
            </div>
          )}

          <div className="formula-row result-row">
            <span>Seu resultado para Δ =</span>
            <MathInput
              value={fields.deltaValue}
              onChange={(value) => updateField('deltaValue', value)}
              label="valor encontrado para delta"
              placeholder="?"
            />
          </div>
        </div>

        {/* Card de Bhaskara */}
        <div className="formula-card">
          <div className="formula-card-header">
            <h4>3. Bhaskara: x = (-b ± √Δ) / 2a</h4>
          </div>
          <div className="fraction-formula">
            <div className="fraction-line fraction-top">
              <span>x =</span>
              <span>-({fields.bhaskaraB || 'b'}) ± √({fields.bhaskaraDelta || 'Δ'})</span>
            </div>
            <div className="fraction-divider" />
            <div className="fraction-line fraction-bottom">
              <span>2 · ({fields.bhaskaraA || 'a'})</span>
            </div>
          </div>

          {hasValidCoeffs && calcDelta !== null && calcDelta >= 0 && (
            <div className="calc-steps-box animate-fadeIn">
              <span className="calc-step-line">
                x = ({-bNum} ± {sqrtDelta !== null && Number.isInteger(sqrtDelta) ? sqrtDelta : sqrtDelta?.toFixed(2)}) / {2 * aNum}
              </span>
            </div>
          )}

          <div className="roots-grid">
            <label>
              <span>x₁</span>
              <input
                value={fields.x1}
                onChange={(event) => updateField('x1', event.target.value)}
                inputMode="decimal"
                placeholder="Raiz 1"
              />
            </label>
            <label>
              <span>x₂</span>
              <input
                value={fields.x2}
                onChange={(event) => updateField('x2', event.target.value)}
                inputMode="decimal"
                placeholder="Raiz 2"
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
