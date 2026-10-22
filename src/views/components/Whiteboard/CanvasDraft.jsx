import { useEffect, useRef, useState } from 'react';
import useCanvasDrawing from './useCanvasDrawing.js';

const TOOLS = [
  { id: 'draw', label: 'Padrão', icon: '✎', shortcut: 'P' },
  { id: 'erase', label: 'Borracha', icon: '⌫', shortcut: 'E' },
  { id: 'text', label: 'Texto', icon: 'T', shortcut: 'T' },
  { id: 'select', label: 'Seleção', icon: '↖', shortcut: 'V' },
];

export default function CanvasDraft() {
  const rootRef = useRef(null);
  const textInputRef = useRef(null);
  const [tool, setTool] = useState('draw');
  const [activeLayer, setActiveLayer] = useState('main');
  const [draftVisible, setDraftVisible] = useState(true);
  const [color, setColor] = useState('#1c4b36');
  const [size, setSize] = useState(3);
  const [textValue, setTextValue] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const canvas = useCanvasDrawing();

  useEffect(() => {
    if (canvas.textPosition) textInputRef.current?.focus();
  }, [canvas.textPosition]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!rootRef.current?.contains(event.target)) return;
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (event.key === 'Escape' && canvas.textPosition) {
        canvas.setTextPosition(null);
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        if (isTyping) return;
        event.preventDefault();
        event.shiftKey ? canvas.redo() : canvas.undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        if (isTyping) return;
        event.preventDefault();
        canvas.redo();
        return;
      }
      if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;
      const shortcutTool = TOOLS.find((entry) => entry.shortcut.toLowerCase() === event.key.toLowerCase());
      if (shortcutTool) setTool(shortcutTool.id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [canvas, tool]);

  const activeItems = canvas.items.filter((item) => item.layer === activeLayer).length;
  const onCanvasPointerDown = (event) => {
    setActionMessage('');
    canvas.onPointerDown(event, activeLayer, tool, color, size);
  };
  const canvasEvents = {
    onPointerDown: onCanvasPointerDown,
    onPointerMove: canvas.onPointerMove,
    onPointerUp: canvas.onPointerUp,
    onPointerCancel: canvas.onPointerUp,
  };

  const submitText = () => {
    canvas.addText(textValue);
    setTextValue('');
  };

  const toggleDraftVisibility = () => {
    setDraftVisible((visible) => {
      if (visible && activeLayer === 'draft') setActiveLayer('main');
      return !visible;
    });
  };
  const activateDraft = () => {
    setDraftVisible(true);
    setActiveLayer('draft');
    setActionMessage('Rascunho ativo. Os traços ficam nesta camada até serem transferidos.');
  };
  const transferDraft = () => {
    const count = canvas.transferDraft();
    if (count) {
      setActiveLayer('main');
      setActionMessage(`${count} ${count === 1 ? 'item transferido' : 'itens transferidos'} para o quadro.`);
    }
  };

  return (
    <section className="canvas-draft" ref={rootRef} aria-label="Quadro de desenho e rascunho">
      <div className="canvas-draft-heading">
        <div><h4>Área de desenho</h4><p>Mouse, toque ou caneta · atalhos P E T V · Ctrl Z / Ctrl Y</p></div>
        <div className="layer-switch" role="group" aria-label="Camada ativa">
          <button type="button" className={activeLayer === 'main' ? 'is-active' : ''} onClick={() => setActiveLayer('main')}>Quadro</button>
          <button type="button" className={activeLayer === 'draft' ? 'is-active' : ''} aria-pressed={activeLayer === 'draft'} onClick={activateDraft}>Rascunho</button>
        </div>
      </div>

      <div className="canvas-toolbar" role="toolbar" aria-label="Ferramentas do quadro">
        <div className="tool-buttons">
          {TOOLS.map((entry) => (
            <button key={entry.id} type="button" title={`${entry.label} (${entry.shortcut})`} aria-label={`${entry.label}, atalho ${entry.shortcut}`} aria-pressed={tool === entry.id} className={tool === entry.id ? 'is-active' : ''} onClick={() => setTool(entry.id)}>
              <span aria-hidden="true">{entry.icon}</span><span className="tool-label">{entry.label}</span>
            </button>
          ))}
        </div>
        <div className="canvas-options">
          <label className="color-option" title="Cor do traço">Cor <input aria-label="Cor do traço" type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
          <label className="size-option" title="Espessura do traço">Traço <input aria-label="Espessura do traço" type="range" min="1" max="12" value={size} onChange={(event) => setSize(Number(event.target.value))} /></label>
          <button type="button" onClick={canvas.undo} disabled={!canvas.history.past.length} aria-label="Desfazer (Ctrl+Z)" title="Desfazer (Ctrl+Z)">↶</button>
          <button type="button" onClick={canvas.redo} disabled={!canvas.history.future.length} aria-label="Refazer (Ctrl+Y)" title="Refazer (Ctrl+Y)">↷</button>
        </div>
      </div>

      <div className={`drawing-surface ${tool === 'text' ? 'cursor-text' : ''}`} aria-label={`${activeLayer === 'draft' ? 'Camada de rascunho' : 'Quadro principal'}; ${activeItems} elementos`}>
        <canvas ref={canvas.mainCanvasRef} tabIndex={0} aria-label="Canvas do quadro principal" className="drawing-canvas main-canvas" {...(activeLayer === 'main' ? canvasEvents : {})} style={{ pointerEvents: activeLayer === 'main' ? 'auto' : 'none', cursor: tool === 'erase' ? 'cell' : tool === 'text' ? 'text' : tool === 'select' ? 'move' : 'crosshair' }} />
        <canvas ref={canvas.draftCanvasRef} tabIndex={0} aria-label="Canvas do rascunho" className={`drawing-canvas draft-canvas ${draftVisible ? '' : 'is-hidden'}`} {...(activeLayer === 'draft' && draftVisible ? canvasEvents : {})} style={{ pointerEvents: activeLayer === 'draft' && draftVisible ? 'auto' : 'none', cursor: tool === 'erase' ? 'cell' : tool === 'text' ? 'text' : tool === 'select' ? 'move' : 'crosshair' }} />
        {canvas.textPosition && (
          <input ref={textInputRef} className="canvas-text-entry" aria-label="Texto para inserir no quadro" placeholder="Digite e pressione Enter" value={textValue} style={{ left: canvas.textPosition.x, top: canvas.textPosition.y }} onChange={(event) => setTextValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submitText(); } if (event.key === 'Escape') { setTextValue(''); canvas.setTextPosition(null); } }} />
        )}
        <div className="canvas-hint" aria-hidden="true">{tool === 'select' ? 'Clique e arraste um item para movê-lo' : tool === 'text' ? 'Clique, digite e pressione Enter' : tool === 'erase' ? 'Arraste sobre os traços para apagar' : `Desenhando em: ${activeLayer === 'draft' ? 'Rascunho' : 'Quadro'}`}</div>
      </div>

      <div className="canvas-footer">
        <div className="draft-actions">
          <button type="button" className="canvas-secondary" aria-pressed={draftVisible} onClick={toggleDraftVisibility}>{draftVisible ? '◉ Ocultar rascunho' : '◎ Exibir rascunho'}</button>
          <button type="button" className="canvas-secondary" onClick={() => canvas.clearLayer(activeLayer)}>Limpar {activeLayer === 'draft' ? 'rascunho' : 'quadro'}</button>
          {activeLayer === 'draft' && <button type="button" className="canvas-transfer" disabled={!canvas.items.some((item) => item.layer === 'draft')} onClick={transferDraft}>↗ Transferir {canvas.items.some((item) => item.id === canvas.selectedId && item.layer === 'draft') ? 'seleção' : 'rascunho'} para o quadro</button>}
        </div>
        <span className="canvas-status" role="status" aria-live="polite">{actionMessage || `${activeItems} ${activeItems === 1 ? 'item' : 'itens'} na camada ${activeLayer === 'draft' ? 'de rascunho' : 'principal'}${activeLayer === 'draft' && !draftVisible ? ' (oculta)' : ''}`}</span>
      </div>
    </section>
  );
}
