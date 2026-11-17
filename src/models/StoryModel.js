import { FRAGMENTS, INTRO_SCENES, ENDING_SCENES, WORLD_STORIES } from '../data/story.js';

// A completedLevels entry can also be an unsuccessful local attempt. Existing stars
// are the reliable record of approval, both in old saves and server progress.
export function hasPassedStoryLevel(gameState, world, level) {
  return (gameState.levelStars?.[world]?.[level] || 0) > 0;
}

export function getStoryProgress(gameState) {
  const fragments = FRAGMENTS.filter((fragment) => hasPassedStoryLevel(gameState, fragment.world, fragment.level));
  return {
    fragments,
    completed: fragments.length === FRAGMENTS.length && hasPassedStoryLevel(gameState, 3, 4),
  };
}

export function getStoryPlayerKey(authUser) {
  return authUser?.id == null ? 'guest' : `user:${authUser.id}`;
}

export function markStoryEventSeen(gameState, playerKey, eventId) {
  const story = gameState.story || {};
  const viewedByPlayer = story.viewedByPlayer || {};
  return {
    ...gameState,
    story: {
      ...story,
      viewedByPlayer: {
        ...viewedByPlayer,
        [playerKey]: { ...viewedByPlayer[playerKey], [eventId]: true },
      },
    },
  };
}

export function getPendingStoryEvents(gameState, playerKey, { intro = false, worldIndex } = {}) {
  const viewed = gameState.story?.viewedByPlayer?.[playerKey] || {};
  const progress = getStoryProgress(gameState);
  const events = [];
  if (intro) events.push({ id: 'intro', scenes: INTRO_SCENES });
  for (const fragment of progress.fragments) {
    events.push({
      id: `fragment:${fragment.id}`,
      scenes: [{ speaker: 'Léo', title: `Fragmento de ${fragment.name} recuperado!`, text: fragment.effect, fragmentId: fragment.id }],
    });
  }
  if (progress.completed) events.push({ id: 'ending', scenes: ENDING_SCENES });
  if (worldIndex != null) {
    const world = WORLD_STORIES[worldIndex];
    events.push({ id: `world:${worldIndex}`, scenes: progress.completed ? [
      { speaker: 'Mestra Álgebra', title: 'Numeria celebra seu retorno', text: 'Guardião dos Números, o Coração está restaurado! Os guardiões mantêm seus desafios para que você continue explorando e aprendendo.' },
    ] : [
      { speaker: 'Mestra Álgebra', title: world.title, text: world.objective },
      { speaker: worldIndex >= 2 ? 'Zero Absoluto' : 'Mestra Álgebra', title: 'Ecos de Numeria', text: world.threat },
    ] });
  }
  return events.filter((event) => !viewed[event.id]);
}

export function getNPCStoryScenes(character, worldIndex, gameState) {
  const { levelIndex, locked, areaName, message } = character;
  const progress = getStoryProgress(gameState);
  const fragment = FRAGMENTS.find((item) => item.world === worldIndex && item.level === levelIndex);
  const title = `${areaName} · ${character.levelName}`;
  // Keep traversal hints from existing NPCs while aligning the Delta hints with
  // the actual phase names (the original map's hints were shifted by one phase).
  const guidance = worldIndex === 2
    ? message?.replace('Calcule o Delta positivo.', 'Investigue o Delta zero.')
      .replace('Delta igual a zero tem raiz única!', 'Delta negativo não tem raiz real!')
      .replace('Delta negativo não tem raiz real! Domine a classificação.', 'Compare os casos do discriminante e domine a classificação.')
    : message;
  if (locked) return [{ speaker: 'Guardião', title, text: 'Léo, esta etapa ainda está bloqueada. Volte ao guardião da fase anterior e supere o desafio dele para continuar a missão.' }];
  const text = progress.completed
    ? 'Guardião dos Números, Numeria celebra sua conquista! Você pode revisitar este desafio e continuar aprendendo.'
    : hasPassedStoryLevel(gameState, worldIndex, levelIndex)
      ? `Léo, sua conquista aqui já ajudou Numeria.${fragment ? ` O fragmento de ${fragment.name} está com você.` : ''} Vamos praticar mais uma vez?`
      : WORLD_STORIES[worldIndex].levels[levelIndex];
  return [
    { speaker: worldIndex === 3 && levelIndex === 4 && !progress.completed ? 'Zero Absoluto' : 'Guardião', title,
      text: worldIndex === 3 && levelIndex === 4 && !progress.completed
        ? 'Então você chegou até meu trono, Léo... Quero ver seu raciocínio enfrentar o Desafio Supremo!'
        : `${text} ${guidance || ''}` },
    { speaker: 'Léo', title: 'Vamos ao desafio!', text: progress.completed
      ? 'Aprender não termina com uma aventura. Quero descobrir mais!'
      : worldIndex === 3 && levelIndex === 4
        ? 'Os sete fragmentos estão comigo, Zero Absoluto. Vou usar tudo o que aprendi para restaurar Numeria!'
        : fragment && !hasPassedStoryLevel(gameState, worldIndex, levelIndex)
          ? `O fragmento de ${fragment.name} está perto. Vou encarar este desafio por Numeria!`
          : ['Cada descoberta começa com um primeiro passo. Vamos investigar!', 'Vou observar as pistas com calma e seguir aprendendo!', 'Já atravessei muitos caminhos. Este enigma também merece atenção!', 'Vou reunir minhas descobertas e preparar o próximo passo!', 'Cheguei até aqui com a ajuda dos guardiões. Vamos continuar!'][levelIndex] },
  ];
}
