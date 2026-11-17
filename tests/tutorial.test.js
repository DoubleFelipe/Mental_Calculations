import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_GAME_STATE, processLevelComplete } from '../src/models/GameModel.js';
import { TUTORIALS, TUTORIAL_VERSION, LEVEL_TUTORIALS, TOPIC_TUTORIAL } from '../src/data/tutorials.js';
import { getLevelTutorialIds, getPendingTutorialIds, completeTutorials, getQuestionTutorialId, getProgressiveHints } from '../src/models/TutorialModel.js';
import { PEDAGOGICAL_MATRIX, generateQuestionForLevel } from '../src/services/mathGenerator.js';

test('old saves receive the preparation without changing gameplay or assuming prior knowledge', () => {
  const oldSave = structuredClone(DEFAULT_GAME_STATE);
  delete oldSave.tutorials;
  oldSave.credits = 432;
  oldSave.levelStars[3][4] = 3;
  const before = structuredClone(oldSave);
  assert.deepEqual(getPendingTutorialIds(oldSave, 'guest', 0, 0), ['introduction', 'coefficients', 'factoring']);
  const next = completeTutorials(oldSave, 'guest', ['introduction']);
  assert.deepEqual(oldSave, before);
  const { tutorials, ...gameplay } = next;
  assert.deepEqual(gameplay, before);
  assert.equal(tutorials.completedByPlayer.guest.introduction, TUTORIAL_VERSION);
});

test('completion survives reload and phase results, avoids repeats, and stays scoped to the player', () => {
  const ids = getLevelTutorialIds(0, 0);
  let state = completeTutorials(structuredClone(DEFAULT_GAME_STATE), 'guest', ids);
  assert.deepEqual(completeTutorials(state, 'guest', [...ids, 'unknown']), state);
  state = JSON.parse(JSON.stringify(state));
  assert.deepEqual(getPendingTutorialIds(state, 'guest', 0, 0), []);
  assert.deepEqual(getPendingTutorialIds(state, 'guest', 0, 1), ['delta']);
  assert.deepEqual(getPendingTutorialIds(state, 'user:42', 0, 0), ids);
  state = processLevelComplete(state, 0, 0, 4, 5, 10000).newState;
  assert.deepEqual(getPendingTutorialIds(state, 'guest', 0, 0), []);
  assert.deepEqual(getPendingTutorialIds(DEFAULT_GAME_STATE, 'guest', 0, 0), ids, 'reset must clear completion');
  state.tutorials.completedByPlayer.guest.introduction = 0;
  assert.deepEqual(getPendingTutorialIds(state, 'guest', 0, 0), ['introduction'], 'new lesson versions can be taught again');
});

test('all 20 phases have progressive prerequisites and practice with feedback for every choice', () => {
  assert.deepEqual(Object.keys(LEVEL_TUTORIALS).sort(), Object.keys(PEDAGOGICAL_MATRIX).sort());
  for (const [key, ids] of Object.entries(LEVEL_TUTORIALS)) {
    assert.equal(new Set(ids).size, ids.length, key);
    assert.deepEqual(ids.slice(0, 2), ['introduction', 'coefficients']);
    for (const id of ids) {
      const lesson = TUTORIALS[id];
      assert.ok(lesson, `${key}: missing ${id}`);
      assert.ok(lesson.pages.length > 0 && lesson.practice.length > 0);
      for (const exercise of lesson.practice) {
        assert.ok(exercise.correct >= 0 && exercise.correct < exercise.options.length);
        assert.equal(new Set(exercise.options).size, exercise.options.length);
        assert.equal(exercise.feedback.length, exercise.options.length);
        assert.ok(exercise.feedback.every((text) => text.trim().length > 0));
      }
    }
    if (ids.includes('bhaskara')) assert.ok(ids.indexOf('delta') < ids.indexOf('bhaskara'));
    if (ids.includes('bhaskaraAdvanced')) assert.ok(ids.indexOf('bhaskara') < ids.indexOf('bhaskaraAdvanced'));
  }
});

test('every possible generated topic has a lesson and three progressive process hints', () => {
  // Seeded sampling exercises every branch of mixed phases reproducibly.
  const originalRandom = Math.random;
  let seed = 872364;
  Math.random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
  const topics = new Set();
  try {
    for (let world = 0; world < 4; world++) {
      for (let level = 0; level < 5; level++) {
        for (let i = 0; i < 120; i++) {
          const question = generateQuestionForLevel(world, level);
          topics.add(question.topic);
          const id = getQuestionTutorialId(question);
          assert.ok(getLevelTutorialIds(world, level).includes(id), `${world}-${level}: ${question.topic}`);
          const hints = getProgressiveHints(question);
          assert.equal(hints.length, 3);
          assert.ok(hints.every((hint) => hint.length > 30 && !hint.includes('undefined') && !hint.includes('NaN')));
          assert.equal(question.delta, question.b ** 2 - 4 * question.a * question.c);
          for (const root of question.roots) assert.ok(Math.abs(question.a * root ** 2 + question.b * root + question.c) < 1e-9);
        }
      }
    }
  } finally { Math.random = originalRandom; }
  assert.deepEqual([...topics].sort(), Object.keys(TOPIC_TUTORIAL).sort());
});

test('incomplete equations get the correct method and real-root caveats are explicit', () => {
  assert.match(getProgressiveHints({ topic: 'Equações Incompletas (c = 0)', a: 1, b: -4, c: 0 })[1], /evidência/);
  assert.match(getProgressiveHints({ topic: 'Equações Incompletas (b = 0)', a: 1, b: 0, c: -9 })[2], /±/);
  assert.match(TUTORIALS.rootProperties.pages[1].note, /Δ ≥ 0/);
  assert.match(TUTORIALS.rootProperties.pages[0].text, /não nulas/);
  assert.match(getProgressiveHints({ topic: 'Bhaskara com a > 1', a: 3, b: -9, c: 6 })[2], /TODO o numerador/);
});

test('worked numerical equalities in the actual lesson text are correct', () => {
  // Evaluate only numeric arithmetic, never arbitrary text. This checks the
  // rendered examples themselves, including intermediate calculations and signs.
  const calculate = (expression) => {
    const normalized = expression.replaceAll('−', '-').replaceAll('·', '*').replaceAll('²', '**2').trim();
    if (!/^[-\d\s()+*/.]+$/.test(normalized) || !/\d/.test(normalized)) return null;
    // An allowlist above limits this expression to numeric arithmetic.
    return Function(`"use strict"; return (${normalized})`)();
  };
  let checked = 0;
  for (const lesson of Object.values(TUTORIALS)) {
    for (const step of [...lesson.pages, ...lesson.practice]) {
      for (const line of (step.formula || '').split('\n')) {
        const expressions = line.split('=');
        let previous = null;
        for (const expression of expressions) {
          const value = calculate(expression);
          if (value !== null && previous !== null) { assert.equal(value, previous, line); checked++; }
          previous = value;
        }
      }
    }
  }
  assert.ok(checked >= 12, `only ${checked} numerical equalities checked`);
});
