// Bancada de integração para Vite, fora do bundle de produção.
// Use uma porta exclusiva para manter o armazenamento separado do jogo normal.
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from '../../src/controllers/GameController';
import Quiz from '../../src/views/pages/Quiz/Quiz';
import worlds from '../../src/data/worlds';
import '../../src/index.css';

function Harness() {
  const [phase, setPhase] = useState('0-0');
  const [run, setRun] = useState(0);
  const [result, setResult] = useState(null);
  const [world, level] = phase.split('-').map(Number);
  return <>
    <style>{'#root { display: flex; flex-direction: column; } header { flex-shrink: 0; } .quiz-page { height: auto; min-height: 0; flex: 1; }'}</style>
    <header style={{ padding: 12, background: '#102515', color: 'white', fontFamily: 'sans-serif' }}>
      <label>Fase de teste <select aria-label="Fase de teste" value={phase} onChange={(event) => { setPhase(event.target.value); setRun((prev) => prev + 1); setResult(null); }}>
        {worlds.flatMap((item, wi) => item.levels.map((entry, li) => <option key={`${wi}-${li}`} value={`${wi}-${li}`}>{wi + 1}.{li + 1} · {entry.name}</option>))}
      </select></label>{' '}
      <button onClick={() => { setRun((prev) => prev + 1); setResult(null); }}>Reabrir fase</button>
      <output aria-label="Resultado de teste">{result}</output>
    </header>
    <GameProvider><Quiz key={`${phase}-${run}`} worldIndex={world} levelIndex={level}
      onExit={() => setResult('Saída recebida')}
      onComplete={(correct, total) => setResult(`Concluído: ${correct}/${total}`)} /></GameProvider>
  </>;
}

const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<StrictMode><Harness /></StrictMode>);
