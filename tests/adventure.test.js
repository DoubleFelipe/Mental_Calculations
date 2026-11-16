import { test } from 'node:test';
import assert from 'node:assert/strict';
import worlds from '../src/data/worlds.js';
import { DEFAULT_GAME_STATE, migrateGameState, processLevelComplete } from '../src/models/GameModel.js';
import { recoveredFragments, isStoryComplete, FRAGMENTS } from '../src/data/story.js';
import { generateAdventureQuestion } from '../src/services/adventureMath.js';
import { createWorldPlatforms } from '../src/engine/Platform.js';
import { adventureCharacters } from '../src/engine/Adventure.js';

test('migrates four-world saves without losing inventory, stars, positions or credits',()=>{
  const old={...DEFAULT_GAME_STATE,credits:321,purchasedItems:['skin_ninja'],worldPositions:{2:{x:950,y:140}},levelStars:[[3,2,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[3,3,3,3,3]],unlockedWorlds:[true,true,true,true]};
  const state=migrateGameState(JSON.parse(JSON.stringify(old)));
  assert.equal(state.levelStars.length,5);assert.equal(state.levelStars[0][1],2);assert.equal(state.unlockedWorlds[4],true);assert.equal(state.credits,321);assert.deepEqual(state.purchasedItems,old.purchasedItems);assert.deepEqual(state.worldPositions,old.worldPositions);
});
test('failure awards no completion or fragment and does not unlock next stage',()=>{
  const {newState,passed}=processLevelComplete(migrateGameState(),0,2,1,5,15000);
  assert.equal(passed,false);assert.equal(newState.completedLevels[0][2],false);assert.equal(newState.unlockedLevels[0][3],false);assert.equal(recoveredFragments(newState).length,0);
});
test('full campaign unlocks five worlds and exactly seven fragments before Zero',()=>{
  let state=migrateGameState();
  for(const world of worlds){
    assert.equal(state.unlockedWorlds[world.id],true);
    for(const level of world.levels){
      assert.equal(state.unlockedLevels[world.id][level.id],true);
      if(world.id===4 && level.id===4){assert.equal(recoveredFragments(state).length,7);assert.equal(isStoryComplete(state),false);}
      state=processLevelComplete(state,world.id,level.id,level.questionsCount,level.questionsCount,10000).newState;
    }
  }
  assert.equal(isStoryComplete(state),true);assert.equal(state.completedLevels.flat().filter(Boolean).length,25);
  for(const f of FRAGMENTS)state=processLevelComplete(state,f.world,f.level,5,5,10000).newState;
  assert.equal(recoveredFragments(state).length,7);
  assert.deepEqual(recoveredFragments(migrateGameState(JSON.parse(JSON.stringify(state)))) ,recoveredFragments(state));
});
test('all environmental seals and boss rounds have supported platform anchors',()=>{
  for(const world of worlds){
    const platforms=createWorldPlatforms(world.id);
    for(let level=0;level<5;level++)for(let charge=0;charge<world.levels[level].questionsCount;charge++){
      const progress=world.levels.map((_,i)=>({unlocked:i<=level,stars:i<level?3:0,charge:i===level?charge:0}));
      const character=adventureCharacters(platforms,world.id,progress)[level];
      assert.ok(platforms[character.platformIndex]);assert.equal(character.locked,false);assert.ok(!platforms[character.platformIndex].secret);
    }
  }
});
test('curriculum generates unique alternatives with one exact correct answer',()=>{
  for(const world of worlds)for(const level of world.levels)for(let round=0;round<100;round++){
    const q=generateAdventureQuestion(world.id,level.id,round%level.questionsCount);
    assert.equal(q.alternatives.length,4);assert.equal(new Set(q.alternatives).size,4);assert.equal(q.alternatives[q.correctIndex],q.correctAnswer);assert.ok(q.explanation);assert.ok(q.topic);
  }
});
test('final confrontation covers six distinct curricular stages in order',()=>{
  const topics=Array.from({length:6},(_,i)=>generateAdventureQuestion(4,4,i).topic);
  assert.match(topics[0],/Adição|Subtração/);assert.match(topics[1],/Multiplicação/);assert.match(topics[2],/frações/);assert.match(topics[3],/Equações/);assert.match(topics[4],/Área|Formas|Perímetro/);assert.equal(topics[5],'Desafio combinado');
});

test('numeric answers match the displayed arithmetic and geometry problems',()=>{
  for(let n=0;n<150;n++)for(const w of [0,1,3,4])for(let l=0;l<4;l++){
    const q=generateAdventureQuestion(w,l,0), values=[...q.text.matchAll(/\d+/g)].map(m=>Number(m[0]));
    let expected;
    if(w===0) expected=q.text.includes('−')?values[0]-values[1]:values[0]+values[1];
    if(w===1) expected=values.reduce((a,b)=>a*b,1);
    if(w===3){ const coefficient=q.text.match(/^(\d+)x/); expected=(values.at(-1)-(coefficient?values[1]:values[0]))/(coefficient?Number(coefficient[1]):1); }
    if(w===4 && l>0)expected=l===1?2*(values[0]+values[1]):values[0]*values[1];
    if(expected!==undefined)assert.equal(Number(q.correctAnswer),expected,q.text);
  }
});
