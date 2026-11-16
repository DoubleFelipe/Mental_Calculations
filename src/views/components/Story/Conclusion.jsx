import useGameState from '../../../controllers/GameController';
import { recoveredFragments, isStoryComplete } from '../../../data/story';
import Heart from './Heart';
import './Story.css';
export default function Conclusion({ onNavigate }) {
  const { gameState } = useGameState();
  return <main className="story-completion">
    <p className="story-eyebrow">A LENDA DOS NÚMEROS PERDIDOS</p>
    <h1>{isStoryComplete(gameState) ? 'Guardião dos Números' : 'A jornada de Léo'}</h1>
    <Heart gameState={gameState} large/>
    <p>A matemática não é apenas números. Ela é a linguagem que ajuda a entender e transformar o mundo.</p>
    <div className="fragment-list">{recoveredFragments(gameState).map(f=><span key={f.id}>◆ {f.name}</span>)}</div>
    <p>{gameState.levelStars.flat().filter(n=>n>0).length}/25 fases restauradas · {gameState.levelStars.flat().reduce((a,b)=>a+b,0)}/75 estrelas</p>
    <div className="story-actions">
      <button className="chalk-btn chalk-btn-green" onClick={()=>onNavigate('worldSelect')}>Jogar novamente · Explorar Numeria</button>
      <button className="chalk-btn chalk-btn-blue" onClick={()=>onNavigate('profile')}>Ver progresso</button>
      <button className="chalk-btn chalk-btn-yellow" onClick={()=>onNavigate('intro')}>Rever abertura</button>
      <button className="story-link" onClick={()=>onNavigate('mainMenu')}>Menu</button>
    </div><p>Para repetir um confronto, entre no reino e escolha “Reenfrentar” no diário.</p>
  </main>;
}
