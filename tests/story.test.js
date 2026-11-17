import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_GAME_STATE, processLevelComplete } from '../src/models/GameModel.js';
import { FRAGMENTS, WORLD_STORIES } from '../src/data/story.js';
import { getStoryProgress, getPendingStoryEvents, getStoryPlayerKey, markStoryEventSeen, getNPCStoryScenes } from '../src/models/StoryModel.js';

const freshState = () => structuredClone(DEFAULT_GAME_STATE);

test('old saves need no migration and failed attempts grant no fragments', () => {
  const state = freshState();
  delete state.story;
  const result = processLevelComplete(state, 0, 1, 2, 5, 10000);
  assert.equal(result.newState.completedLevels[0][1], true);
  assert.equal(result.passed, false);
  assert.deepEqual(getStoryProgress(result.newState), { fragments: [], completed: false });
  assert.deepEqual(getPendingStoryEvents(result.newState, 'guest', { intro: true }).map((event) => event.id), ['intro']);
});

test('each milestone grants exactly one fragment at the existing approval threshold', () => {
  let state = freshState();
  let count = 0;
  for (let world = 0; world < 4; world++) {
    for (let level = 0; level < 5; level++) {
      const before = structuredClone(state);
      const total = level === 4 ? (world === 3 ? 10 : 7) : 5;
      state = processLevelComplete(state, world, level, Math.ceil(total * .6), total, 10000).newState;
      if (FRAGMENTS.some((fragment) => fragment.world === world && fragment.level === level)) count++;
      const gameplay = structuredClone(state);
      const progress = getStoryProgress(state);
      assert.equal(progress.fragments.length, count);
      assert.equal(progress.completed, world === 3 && level === 4);
      assert.deepEqual(state, gameplay, 'reading narrative must never mutate gameplay');
      assert.notDeepEqual(state.levelStars, before.levelStars);
    }
  }
  const replay = processLevelComplete(state, 3, 3, 5, 5, 10000).newState;
  assert.equal(getStoryProgress(replay).fragments.length, 7);
});

test('seven fragments precede the final battle; only final approval concludes the story', () => {
  let state = freshState();
  for (const fragment of FRAGMENTS) state.levelStars[fragment.world][fragment.level] = 1;
  assert.equal(getStoryProgress(state).fragments.length, 7);
  assert.equal(getStoryProgress(state).completed, false);
  state = processLevelComplete(state, 3, 4, 5, 10, 10000).newState;
  assert.equal(getStoryProgress(state).completed, false);
  state = processLevelComplete(state, 3, 4, 6, 10, 10000).newState;
  assert.equal(getStoryProgress(state).completed, true);
});

test('viewed events survive serialization, remain idempotent and are scoped per player', () => {
  const initial = freshState();
  const next = markStoryEventSeen(initial, 'guest', 'intro');
  assert.equal(initial.story.viewedByPlayer.guest, undefined);
  assert.deepEqual(markStoryEventSeen(next, 'guest', 'intro'), next);
  const restored = JSON.parse(JSON.stringify(next));
  assert.deepEqual(getPendingStoryEvents(restored, 'guest', { intro: true }), []);
  assert.equal(getPendingStoryEvents(restored, 'user:42', { intro: true })[0].id, 'intro');
  assert.equal(getStoryPlayerKey(null), 'guest');
  assert.equal(getStoryPlayerKey({ id: 42 }), 'user:42');
  const { story: _initialStory, ...initialGameplay } = initial;
  const { story: _nextStory, ...nextGameplay } = next;
  assert.deepEqual(nextGameplay, initialGameplay);
  assert.ok(_initialStory && _nextStory);
});

test('legacy/server stars reconstruct all rewards and unseen events can resume after reload', () => {
  let state = freshState();
  delete state.story;
  state.levelStars = Array.from({ length: 4 }, () => [1, 1, 1, 1, 1]);
  const pending = getPendingStoryEvents(state, 'guest', { intro: true });
  assert.equal(pending.length, 9);
  assert.equal(pending[0].id, 'intro');
  assert.equal(pending.at(-1).id, 'ending');
  for (const event of pending) state = markStoryEventSeen(state, 'guest', event.id);
  assert.deepEqual(getPendingStoryEvents(JSON.parse(JSON.stringify(state)), 'guest', { intro: true }), []);
  assert.equal(getPendingStoryEvents(freshState(), 'guest', { intro: true })[0].id, 'intro', 'existing reset starts the introduction again');
});

test('all existing worlds and NPC phases have context, locked guidance and replay recognition', () => {
  for (let world = 0; world < 4; world++) {
    assert.equal(WORLD_STORIES[world].levels.length, 5);
    for (let level = 0; level < 5; level++) {
      const character = { levelIndex: level, areaName: 'Área', levelName: 'Fase', message: 'Fala original' };
      const scenes = getNPCStoryScenes(character, world, freshState());
      assert.ok(scenes[0].text.length > 20);
      if (world !== 3 || level !== 4) assert.ok(scenes[0].text.includes(character.message));
      assert.match(getNPCStoryScenes({ ...character, locked: true }, world, freshState())[0].text, /bloqueada/);
      const state = freshState();
      state.levelStars[world][level] = 1;
      if (world !== 3 || level !== 4) assert.match(getNPCStoryScenes(character, world, state)[0].text, /conquista/);
    }
  }
});
