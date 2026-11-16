import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import GameCanvas from '../../../engine/GameCanvas';
import useGameState from '../../../controllers/GameController';
import useAudio from '../../../hooks/useAudio';
import worlds from '../../../data/worlds';
import { recoveredFragments, isStoryComplete, WORLD_DIALOGUES, BOSS_TAUNTS, FINAL_TOPICS } from '../../../data/story';
import { generateAdventureQuestion } from '../../../services/adventureMath';
import { progressApi } from '../../../services/apiService';
import Heart from '../../components/Story/Heart';
import './PlatformGame.css';
import '../../components/Story/Story.css';

const EMPTY = [];
const EMPTY_CHARGES = {};
export default function PlatformGame({ worldIndex, onStartQuiz, onNavigate }) {
  const { gameState, settings, loseLife, resetLives, saveWorldPosition, clearWorldPosition, collectMoneyBag, updateStory, recordConceptualError, completeLevelAction, isOnline } = useGameState();
  const audio = useAudio(settings);
  const world = worlds[worldIndex];
  // A checkpoint is only a spawn on mount. Autosaving must not teleport the player.
  const [spawn, setSpawn] = useState(() => gameState.worldPositions?.[worldIndex] || null);
  const [isPaused, setIsPaused] = useState(false);
  const [modal, setModal] = useState(() => (gameState.story.seenWorlds || []).includes(worldIndex) ? null : {kind:'intro'});
  const [isGameOver, setIsGameOver] = useState(gameState.lives <= 0);
  const [replayLevel, setReplayLevel] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const busyRef = useRef(false);
  const focusRef = useRef(null);
  const beforeFocusRef = useRef(null);
  const charges = gameState.story.charges || EMPTY_CHARGES;
  const fragments = recoveredFragments(gameState);
  const complete = isStoryComplete(gameState);
  useEffect(() => {
    if (modal || isPaused || isGameOver) {
      beforeFocusRef.current = document.activeElement;
      focusRef.current?.focus({preventScroll:true});
      return () => beforeFocusRef.current?.focus?.();
    }
  }, [modal, isPaused, isGameOver]);
  const savePosition = useCallback(pos => saveWorldPosition(worldIndex,pos), [saveWorldPosition,worldIndex]);
  const handleNPCInteract = useCallback((character, pos) => {
    savePosition(pos);
    setAnswer(null);setSaveError('');
    if (character.locked) { setModal({kind:'notice', text:'Mestra Álgebra: restaure o mecanismo anterior para liberar este caminho.'});return; }
    if (worldIndex === 4 && character.levelIndex === 4 && recoveredFragments(gameState).length < 7) {
      setModal({kind:'notice',text:'O Templo só se abrirá com os sete fragmentos. Consulte o Coração no diário.'});return;
    }
    setModal({kind:'puzzle',character,question:generateAdventureQuestion(worldIndex,character.levelIndex,character.charge),started:Date.now()});
  }, [savePosition,worldIndex,gameState]);
  const handlePlayerHit = useCallback(() => {
    if (gameState.lives <= 1) setIsGameOver(true);
    loseLife();
  }, [gameState.lives,loseLife]);
  const restart = () => { resetLives();clearWorldPosition(worldIndex);setSpawn({x:80,y:440});setIsGameOver(false); };
  const levelProgress = useMemo(() => world.levels.map((level,index)=>({
    levelIndex:index, levelName:level.name, stars:replayLevel === index ? 0 : gameState.levelStars[worldIndex]?.[index] || 0,
    unlocked:gameState.unlockedLevels[worldIndex]?.[index] ?? false, charge:charges[`${worldIndex}-${index}`] || 0,
  })), [world,worldIndex,gameState.levelStars,gameState.unlockedLevels,charges,replayLevel]);
  const active = levelProgress.find(p=>p.unlocked && !p.stars);
  const dismiss = () => { setModal(null);setAnswer(null);setSaveError(''); };
  const submit = useCallback((index) => {
    if (answer !== null || busyRef.current) return;
    audio.initAudio();
    const correct = index === modal.question.correctIndex;
    setAnswer({index,correct,elapsed:Math.max(1000,Date.now()-modal.started)});
    if (correct) audio.playCorrect();else {
      audio.playWrong();
      recordConceptualError({topic:modal.question.topic,questionText:modal.question.text,wrongAnswer:modal.question.alternatives[index],correctAnswer:modal.question.correctAnswer,diagnostic:modal.question.explanation});
    }
  }, [answer, modal, audio, recordConceptualError]);
  const restore = async () => {
    if (busyRef.current || !answer?.correct) return;
    busyRef.current=true;setSaving(true);setSaveError('');
    const { character } = modal;
    const key = `${worldIndex}-${character.levelIndex}`;
    const nextCharge = character.charge+1;
    const elapsedTimes = [...(gameState.story.elapsedTimes?.[key] || []).slice(0,character.charge), answer.elapsed];
    const averageTime = Math.round(elapsedTimes.reduce((sum,time)=>sum+time,0)/elapsedTimes.length);
    try {
      if (character.type === 'secret') {
        updateStory({secrets:{...gameState.story.secrets,[worldIndex]:true}});
        setModal({kind:'notice',text:'Mestra Álgebra: o enigma revelou uma rota secreta! Alcance as nuvens para recolher os tesouros.'});setAnswer(null);
      } else if (nextCharge < character.count) {
        updateStory({charges:{...charges,[key]:nextCharge},elapsedTimes:{...gameState.story.elapsedTimes,[key]:elapsedTimes}});
        dismiss();
      } else {
        let attemptId=null;
        if(isOnline) { const attempt=await progressApi.startLevel(worldIndex*5+character.levelIndex+1);attemptId=attempt.attemptId; }
        const result=await completeLevelAction(worldIndex,character.levelIndex,character.count,character.count,averageTime,1,attemptId);
        setReplayLevel(null);
        const state=result.newState;
        const newlyFound=state ? recoveredFragments(state).filter(f=>!fragments.some(old=>old.id===f.id)) : [];
        if(worldIndex===4 && character.levelIndex===4){ onNavigate('ending');return; }
        setModal({kind:'notice',text:newlyFound.length ? `Léo: encontrei ${newlyFound[0].name}! Mestra Álgebra: mais uma energia voltou ao Coração. ${character.levelIndex===4 ? 'O próximo reino está aberto.' : 'Continue seguindo os selos.'}` : character.levelIndex===4 ? `Mestra Álgebra: ${world.boss} foi vencido! O caminho para ${worlds[worldIndex+1]?.name || 'o templo'} está aberto.` : 'Léo: o mecanismo voltou a funcionar! Vou seguir a luz até o próximo desafio.', warning:result.syncWarning});
        audio.playVictory();
      }
    } catch(error) { setSaveError(`Não foi possível registrar a conquista: ${error.message}. Tente salvar novamente; o selo permanece resolvido.`); }
    finally {busyRef.current=false;setSaving(false);}
  };
  const handleModalKeys = (event) => {
    if (event.key === 'Escape' && !saving && !isGameOver) {
      event.stopPropagation();
      if (isPaused) setIsPaused(false);
      else if (modal?.kind === 'intro') startWorld();
      else dismiss();
    }
    if (event.key !== 'Tab') return;
    const buttons = [...event.currentTarget.querySelectorAll('button:not([disabled]), [tabindex="0"]')];
    const first = buttons[0], last = buttons[buttons.length-1];
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) { event.preventDefault();last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first.focus(); }
  };
  const startWorld = () => { updateStory({seenWorlds:[...new Set([...(gameState.story.seenWorlds || []),worldIndex])]});dismiss(); };
  return <div className="platform-game">
    <div className="game-hud"><div className="hud-left"><div className="hud-lives" aria-label={`${gameState.lives} vidas`}>{'❤️'.repeat(gameState.lives)}{'🖤'.repeat(Math.max(0,3-gameState.lives))}</div><div className="hud-coins">💰 {gameState.credits}</div></div>
      <div className="hud-center"><span className="hud-world">{world.name}</span><span className="hud-level">Léo · Aprendiz de Numeria</span></div>
      <div className="hud-right"><Heart gameState={gameState}/><button className="hud-pause-btn" aria-label="Pausar aventura" onClick={()=>setIsPaused(true)}>⏸</button></div></div>
    <div className="story-objective"><span>{active ? `Objetivo: ${world.levels[active.levelIndex].name} · Selo ${active.charge+1}/${world.levels[active.levelIndex].questionsCount}` : 'Reino restaurado. Explore as rotas secretas ou siga para o próximo mundo.'}</span><button className="story-link" onClick={()=>setModal({kind:'journal'})}>Coração e diário</button>{!active && <button className="story-link" onClick={()=>onNavigate(complete?'conclusion':'worldSelect')}>{complete?'Ver conquista':'Próximo mundo'} →</button>}</div>
    <div className="game-canvas-container"><GameCanvas worldIndex={worldIndex} initialPosition={spawn} onNPCInteract={handleNPCInteract} onPlayerHit={handlePlayerHit} onMoneyBagCollect={collectMoneyBag} onPositionSave={savePosition} collectedMoneyBags={gameState.collectedMoneyBags || EMPTY} levelProgress={levelProgress} isPaused={isPaused || Boolean(modal) || isGameOver} equippedSkin={gameState.equippedSkin} doubleJumpEnabled={Boolean(settings.doubleJump)} difficulty={settings.difficulty} restored={complete} secretSolved={Boolean(gameState.story.secrets?.[worldIndex])}/></div>
    <div className="game-instructions">A/D ou ← → mover · Espaço pular · E interagir · Resolva um selo e siga sua luz.</div>
    {(modal || isPaused || isGameOver) && <div className="story-modal-backdrop"><section className="story-modal" role="dialog" aria-modal="true" aria-label={isGameOver?'Fim de jogo':isPaused?'Pausa':modal?.kind==='puzzle'?'Desafio matemático':'Diário de Numeria'} tabIndex={-1} ref={focusRef} onKeyDown={handleModalKeys}>
      {isGameOver ? <><h2>A jornada ainda tem solução</h2><p>Seus selos e fragmentos estão salvos. Recupere três vidas e tente novamente.</p><div className="story-actions"><button className="chalk-btn chalk-btn-green" onClick={restart}>Recomeçar mapa</button><button className="chalk-btn" onClick={()=>{resetLives();onNavigate('worldSelect');}}>Mundos</button></div></> : isPaused ? <><h2>Aventura pausada</h2><div className="story-actions"><button className="chalk-btn chalk-btn-green" onClick={()=>setIsPaused(false)}>Continuar</button><button className="chalk-btn" onClick={()=>onNavigate('worldSelect')}>Mundos</button><button className="chalk-btn" onClick={()=>onNavigate('mainMenu')}>Menu</button></div></> : modal.kind==='intro' ? <><p className="story-eyebrow">MESTRA ÁLGEBRA · REINO {worldIndex+1}</p><h2>{world.name}</h2><p>{WORLD_DIALOGUES[worldIndex]}</p><p>Ative os selos com E. Cada acerto abre o caminho até o próximo. Nos confrontos, salte sobre as ondas e alcance o selo iluminado.</p>{worldIndex>0 && <p>Zero Absoluto: “Quero ver até onde a sua curiosidade vai levar você…”</p>}<button className="chalk-btn chalk-btn-green" onClick={startWorld}>Vamos, Léo →</button></> : modal.kind==='puzzle' ? <>
        <p className="story-eyebrow">{modal.character.type==='boss' ? world.boss : 'MESTRA ÁLGEBRA'} · SELO {modal.character.charge+1}/{modal.character.count}</p><h2>{worldIndex===4 && modal.character.levelIndex===4 ? FINAL_TOPICS[modal.character.charge] : modal.character.phaseName}</h2>
        {modal.character.type==='boss' && <p>{BOSS_TAUNTS[worldIndex]}</p>}
        <p className="question-text">{modal.question.text}</p><div className="story-options">{modal.question.alternatives.map((option,i)=><button key={i} className={`chalk-btn ${answer?.index===i ? answer.correct?'chalk-btn-green':'chalk-btn-red':'chalk-btn-blue'}`} disabled={answer!==null || saving} onClick={()=>submit(i)}>{option}</button>)}</div>
        {answer && <p className={`story-feedback ${answer.correct?'success':''}`} role="status">{answer.correct?'Energia restaurada!':'Vamos pensar de outro jeito.'} {modal.question.explanation}</p>}
        {saveError && <p role="alert">{saveError}</p>}
        <div className="story-actions">{answer?.correct ? <button className="chalk-btn chalk-btn-green" disabled={saving} onClick={restore}>{saving?'Salvando…':modal.character.charge+1===modal.character.count?'Concluir mecanismo →':'Liberar caminho →'}</button> : answer ? <button className="chalk-btn chalk-btn-yellow" onClick={()=>setAnswer(null)}>Tentar novamente</button> : null}<button className="story-link" disabled={saving} onClick={dismiss}>Voltar ao cenário</button></div>
      </> : modal.kind==='journal' ? <><h2>Coração dos Cálculos</h2><Heart gameState={gameState} large/><div className="fragment-list">{fragments.map(f=><span key={f.id}>◆ {f.name}</span>)}</div><p>{fragments.length===7?'Os sete fragmentos estão reunidos! O Templo dos Números aguarda Léo.':WORLD_DIALOGUES[worldIndex]}</p><p>Os fragmentos vêm da clareira e do chefe da floresta, do núcleo e do chefe das cavernas, dos chefes do deserto e da torre e do santuário geométrico.</p><div className="story-actions"><button className="chalk-btn chalk-btn-green" onClick={dismiss}>Continuar jornada</button><button className="story-link" onClick={()=>onStartQuiz(worldIndex,active?.levelIndex || 0)}>Treinar matemática</button>{gameState.levelStars[worldIndex]?.[4]>0 && <button className="story-link" onClick={()=>{updateStory({charges:{...charges,[`${worldIndex}-4`]:0},elapsedTimes:{...gameState.story.elapsedTimes,[`${worldIndex}-4`]:[]}});setReplayLevel(4);dismiss();}}>Reenfrentar {world.boss}</button>}</div></> : <><h2>Uma nova luz em Numeria</h2><p>{modal.text}</p>{modal.warning && <p role="status">{modal.warning}</p>}<button className="chalk-btn chalk-btn-green" onClick={dismiss}>Continuar →</button></>}
    </section></div>}
  </div>;
}
