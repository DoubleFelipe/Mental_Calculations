import { useState, useRef } from 'react';
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

const COLOR_OPTIONS = [
  { label: 'Grafite', color: '#1f2a22' },
  { label: 'Azul', color: '#1565c0' },
  { label: 'Verde', color: '#2e7d32' },
  { label: 'Vermelho', color: '#c62828' },
  { label: 'Laranja', color: '#ef6c00' },
];

const STROKE_WIDTHS = [
  { label: 'Fino', value: 2 },
  { label: 'Médio', value: 4 },
  { label: 'Grosso', value: 8 },
];

export default function Whiteboard({ question = null }) {
  // Modo de visualização: 'structured' (fórmulas) ou 'freehand' (desenho livre e bloco de notas)
  const [mode, setMode] = useState('structured');
  const [fields, setFields] = useState(INITIAL_FIELDS);

  // Estados do Modo Rascunho Livre
  const [freehandText, setFreehandText] = useState('');
  const [strokeColor, setStrokeColor] = useState('#1f2a22');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

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

  const clearStructuredBoard = () => {
    setFields(INITIAL_FIELDS);
  };

  // Funções de Canvas do Modo Rascunho Livre
  const getCanvasCoords = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      event.target.setPointerCapture?.(event.pointerId);
    } catch {
      // Ignorar fallback de navegadores que não suportam pointer capture
    }

    isDrawingRef.current = true;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(event, canvas);

    ctx.beginPath();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Ponto inicial para suportar clique ou toque estático
    ctx.arc(x, y, (ctx.lineWidth || 2) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (event) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(event, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (event) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.closePath();
      try {
        event.target.releasePointerCapture?.(event.pointerId);
      } catch {
        // Ignorar fallback
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearFreehand = () => {
    clearCanvas();
    setFreehandText('');
  };

  const aNum = parseFloat(fields.a);
  const bNum = parseFloat(fields.b);
  const cNum = parseFloat(fields.c);
  const hasValidCoeffs = !isNaN(aNum) && !isNaN(bNum) && !isNaN(cNum);
  const calcDelta = hasValidCoeffs ? (bNum * bNum - 4 * aNum * cNum) : null;
  const sqrtDelta = calcDelta !== null && calcDelta >= 0 ? Math.sqrt(calcDelta) : null;

  return (
    <section className="whiteboard-root" aria-label="Quadro de apoio para cálculos">
      {/* Cabeçalho */}
      <div className="whiteboard-header">
        <div>
          <h3>📐 Quadro de Apoio ao Cálculo</h3>
          <p>Organize suas contas passo a passo ou rascunhe livremente sem perder tempo.</p>
        </div>

        <div className="whiteboard-actions">
          {/* Botão de Alternância de Modo (Toggle) */}
          <button
            className={`chalk-btn whiteboard-toggle-btn ${mode === 'structured' ? 'chalk-btn-blue' : 'chalk-btn-yellow'}`}
            type="button"
            onClick={() => setMode((current) => (current === 'structured' ? 'freehand' : 'structured'))}
            title={mode === 'structured' ? 'Alternar para Rascunho Livre' : 'Alternar para Modo Estruturado'}
          >
            {mode === 'structured' ? '✏️ Alternar para Rascunho Livre' : '📐 Alternar para Modo Estruturado'}
          </button>

          {mode === 'structured' && question && (question.a !== undefined || question.text) && (
            <button
              className="chalk-btn whiteboard-load-btn"
              type="button"
              onClick={handleLoadFromQuestion}
              title="Preenche a, b e c da questão atual automaticamente"
            >
              ⚡ Usar dados da questão
            </button>
          )}

          <button
            className="chalk-btn whiteboard-clear"
            type="button"
            onClick={mode === 'structured' ? clearStructuredBoard : clearFreehand}
            title={mode === 'structured' ? 'Limpar campos da fórmula' : 'Limpar anotações e desenho do rascunho'}
          >
            {mode === 'structured' ? 'Limpar Campos' : 'Limpar Rascunho'}
          </button>
        </div>
      </div>

      {/* Navegação por Abas para Acessibilidade e Clareza */}
      <div className="whiteboard-tabs" role="tablist" aria-label="Modos do quadro">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'structured'}
          className={`whiteboard-tab ${mode === 'structured' ? 'active' : ''}`}
          onClick={() => setMode('structured')}
        >
          📐 Modo Estruturado
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'freehand'}
          className={`whiteboard-tab ${mode === 'freehand' ? 'active' : ''}`}
          onClick={() => setMode('freehand')}
        >
          ✏️ Rascunho Livre
        </button>
      </div>

      {/* Banner de Dica de Cálculo Mental (visível em ambos os modos para apoio contínuo) */}
      {question?.mentalTip && (
        <div className="whiteboard-tip-banner">
          <span className="tip-icon">💡</span>
          <span><strong>Dica de cálculo mental:</strong> {question.mentalTip}</span>
        </div>
      )}

      {/* PAINEL 1: Modo Estruturado (inputs guiados para Delta e Bhaskara) */}
      <div
        className="whiteboard-panel"
        role="tabpanel"
        hidden={mode !== 'structured'}
        style={{ display: mode === 'structured' ? 'flex' : 'none' }}
      >
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
      </div>

      {/* PAINEL 2: Modo Rascunho Livre (Canvas 2D para desenho e Bloco de Notas) */}
      <div
        className="whiteboard-panel whiteboard-freehand-panel"
        role="tabpanel"
        hidden={mode !== 'freehand'}
        style={{ display: mode === 'freehand' ? 'flex' : 'none' }}
      >
        {/* Barra de Ferramentas do Canvas */}
        <div className="freehand-toolbar" aria-label="Ferramentas de rascunho">
          <div className="freehand-tool-group">
            <span className="freehand-tool-label">Traço:</span>
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.color}
                type="button"
                className={`freehand-color-swatch ${!isEraser && strokeColor === c.color ? 'selected' : ''}`}
                style={{ backgroundColor: c.color }}
                onClick={() => {
                  setStrokeColor(c.color);
                  setIsEraser(false);
                }}
                title={`Cor ${c.label}`}
                aria-label={`Cor ${c.label}`}
              />
            ))}
            <button
              type="button"
              className={`chalk-btn freehand-tool-btn ${isEraser ? 'chalk-btn-yellow' : ''}`}
              onClick={() => setIsEraser((curr) => !curr)}
              title="Alternar modo Borracha"
            >
              🧹 {isEraser ? 'Borracha Ativa' : 'Borracha'}
            </button>
          </div>

          <div className="freehand-tool-group">
            <span className="freehand-tool-label">Espessura:</span>
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.value}
                type="button"
                className={`chalk-btn freehand-width-btn ${strokeWidth === sw.value ? 'chalk-btn-green' : ''}`}
                onClick={() => setStrokeWidth(sw.value)}
              >
                {sw.label}
              </button>
            ))}
            <button
              type="button"
              className="chalk-btn freehand-clear-canvas-btn"
              onClick={clearCanvas}
              title="Apagar apenas o desenho do quadro"
            >
              🗑️ Limpar Desenho
            </button>
          </div>
        </div>

        {/* Área do Canvas de Desenho */}
        <div className="freehand-canvas-wrapper">
          <div className="freehand-canvas-hint">
            <span>✍️ Desenhe livremente com o mouse ou toque na tela (Suporta dispositivos touch e canetas stylus)</span>
          </div>
          <canvas
            ref={canvasRef}
            width={720}
            height={320}
            className="freehand-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Área de desenho livre do quadro de apoio"
          />
        </div>

        {/* Bloco de Notas Semântico em Texto Livre */}
        <div className="freehand-notes-section">
          <div className="freehand-notes-header">
            <span className="section-label">📝 Bloco de Notas Rápido (Texto Livre):</span>
            {freehandText && (
              <button
                type="button"
                className="freehand-clear-text-btn"
                onClick={() => setFreehandText('')}
                title="Limpar bloco de notas"
              >
                Limpar Texto
              </button>
            )}
          </div>
          <textarea
            className="freehand-textarea"
            rows={4}
            value={freehandText}
            onChange={(e) => setFreehandText(e.target.value)}
            placeholder="Digite anotações rápidas, contas ou raciocínios aqui caso prefira o teclado..."
            aria-label="Anotações de texto livre"
          />
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
