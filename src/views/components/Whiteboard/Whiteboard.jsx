import React, { useRef, useEffect, useState } from 'react';
import './Whiteboard.css';

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [text, setText] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = Math.max(320, rect.width * 0.98);
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  function getCtx() {
    return canvasRef.current.getContext('2d');
  }

  function startDraw(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const ctx = getCtx();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  }

  function draw(e) {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const ctx = getCtx();
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function endDraw() {
    if (!drawing) return;
    const ctx = getCtx();
    ctx.closePath();
    setDrawing(false);
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function addTextToCanvas() {
    if (!text) return;
    const ctx = getCtx();
    ctx.fillStyle = color;
    ctx.font = `${Math.max(14, size * 6)}px serif`;
    ctx.fillText(text, 10, 30);
    setText('');
  }

  function downloadPNG() {
    const link = document.createElement('a');
    link.download = 'quadro-branco.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="whiteboard-root">
      <div className="whiteboard-toolbar">
        <label>Cor: <input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
        <label>Tamanho: <input type="range" min="1" max="12" value={size} onChange={e => setSize(Number(e.target.value))} /></label>
        <button className="chalk-btn" onClick={clearBoard}>Limpar</button>
        <input className="wb-text-input" placeholder="Digite fórmula (ex: x = (-b ± √Δ) / 2a)" value={text} onChange={e => setText(e.target.value)} />
        <button className="chalk-btn" onClick={addTextToCanvas}>Adicionar Texto</button>
      </div>

      <div className="whiteboard-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  );
}
