/**
 * Mental Calculations — Platforms & Portals
 * Plataformas, elevadores, perigos e NPCs para cada mundo
 */

// =============================================================================
// PLATAFORMAS DE CADA MUNDO (Layouts exclusivos e variados)
// =============================================================================

/** Mundo 0: Mundo das Equações (Natureza & Floresta) */
export const WORLD_0_PLATFORMS = [
  // 0: Spawn & Casa Inicial
  { x: 0, y: 520, width: 340, height: 34, area: 1 },
  // 1: Entrada da Floresta (NPC 1)
  { x: 380, y: 480, width: 170, height: 30, area: 1 },
  // 2: Primeiro rochedo
  { x: 600, y: 440, width: 150, height: 30, area: 1 },
  // 3: Elevador da Floresta (Sobe de y=460 a y=260)
  { x: 800, y: 440, width: 120, height: 26, area: 2, elevator: true, baseY: 360, rangeY: 100, speed: 0.0016, guideTop: 240, guideBottom: 480 },
  // 4: Rota Alta - Copa das Árvores
  { x: 970, y: 260, width: 170, height: 26, area: 2, suspended: true },
  // 5: Copa das Árvores (NPC 2)
  { x: 1190, y: 230, width: 180, height: 26, area: 2, elevated: true },
  // 6: Rota Baixa alternativa
  { x: 960, y: 510, width: 170, height: 30, area: 2, alternate: true },
  // 7: Rota Baixa continuidade
  { x: 1170, y: 470, width: 150, height: 30, area: 2, alternate: true },
  // 8: Plataforma de reencontro das rotas
  { x: 1410, y: 390, width: 170, height: 30, area: 3 },
  // 9: Vale Suspenso (NPC 3)
  { x: 1630, y: 350, width: 160, height: 30, area: 3 },
  // 10: Plataforma móvel horizontal 1
  { x: 1840, y: 370, width: 115, height: 26, area: 3, moving: true, baseX: 1890, range: 70, speed: 0.002 },
  // 11: Plataforma móvel horizontal 2 (oposição de fase)
  { x: 2060, y: 410, width: 115, height: 26, area: 4, moving: true, baseX: 2110, range: 70, speed: 0.002, phase: Math.PI },
  // 12: Plataforma suspensa do penhasco
  { x: 2260, y: 350, width: 150, height: 30, area: 4, suspended: true },
  // 13: Passo do Vento (NPC 4)
  { x: 2460, y: 310, width: 170, height: 30, area: 4 },
  // 14: Elevador descendo em direção ao castelo
  { x: 2680, y: 330, width: 120, height: 26, area: 5, elevator: true, baseY: 420, rangeY: 90, speed: 0.0018, guideTop: 300, guideBottom: 530 },
  // 15: Entrada do castelo
  { x: 2840, y: 490, width: 150, height: 30, area: 5 },
  // 16: Pátio do Castelo (NPC 5 / Final)
  { x: 2980, y: 520, width: 250, height: 34, area: 5 },
];

/** Mundo 1: Mundo dos Coeficientes (Costa Marítima & Ilhas Flutuantes) */
export const WORLD_1_PLATFORMS = [
  // 0: Cais inicial de madeira com Casa
  { x: 0, y: 520, width: 320, height: 34, area: 1 },
  // 1: Farol da praia (NPC 1)
  { x: 360, y: 490, width: 160, height: 28, area: 1 },
  // 2: Rochedo de coral marinho
  { x: 560, y: 450, width: 140, height: 28, area: 1 },
  // 3: Jangada flutuante móvel sobre o mar
  { x: 740, y: 480, width: 120, height: 24, area: 1, moving: true, baseX: 790, range: 70, speed: 0.0018 },
  // 4: Ilhota de conchas
  { x: 920, y: 460, width: 140, height: 28, area: 2 },
  // 5: Elevador Gêiser Marítimo (Sobe de y=460 até y=180!)
  { x: 1100, y: 460, width: 125, height: 26, area: 2, elevator: true, baseY: 320, rangeY: 140, speed: 0.0016, guideTop: 160, guideBottom: 490 },
  // 6: Ilha das Nuvens Tropicais (NPC 2)
  { x: 1270, y: 190, width: 180, height: 28, area: 2, elevated: true },
  // 7: Passarela aérea de nuvens
  { x: 1490, y: 220, width: 130, height: 26, area: 2, alternate: true },
  // 8: Jangada aérea móvel das gaivotas
  { x: 1660, y: 240, width: 110, height: 24, area: 3, moving: true, baseX: 1710, range: 75, speed: 0.0022 },
  // 9: Cais inferior alternativo (rota marítima de recifes)
  { x: 1280, y: 500, width: 150, height: 28, area: 2, alternate: true },
  // 10: Jangada média inferior
  { x: 1480, y: 490, width: 120, height: 24, area: 2, moving: true, baseX: 1530, range: 60, speed: 0.002 },
  // 11: Grande Recife Central (NPC 3)
  { x: 1830, y: 350, width: 190, height: 30, area: 3 },
  // 12: Elevador da Cascata Marinha (Sobe de y=460 a y=250)
  { x: 2060, y: 350, width: 120, height: 26, area: 3, elevator: true, baseY: 355, rangeY: 105, speed: 0.0019, guideTop: 230, guideBottom: 480 },
  // 13: Jangada oscilante dupla A
  { x: 2230, y: 260, width: 115, height: 26, area: 4, moving: true, baseX: 2280, range: 70, speed: 0.0021, phase: 0 },
  // 14: Jangada oscilante dupla B
  { x: 2420, y: 320, width: 115, height: 26, area: 4, moving: true, baseX: 2470, range: 70, speed: 0.0021, phase: Math.PI },
  // 15: Rochedo do Farol Oceânico (NPC 4)
  { x: 2600, y: 280, width: 160, height: 30, area: 4, elevated: true },
  // 16: Ponte suspensa de cordas e corais
  { x: 2800, y: 420, width: 140, height: 28, area: 5 },
  // 17: Palácio Submerso de Atlântida (NPC 5 / Final)
  { x: 2980, y: 520, width: 240, height: 34, area: 5 },
];

/** Mundo 2: Mundo do Delta (Canyons Elétricos & Pirâmides Douradas) */
export const WORLD_2_PLATFORMS = [
  // 0: Plataforma inicial de arenito com Casa
  { x: 0, y: 520, width: 330, height: 34, area: 1 },
  // 1: Posto dos exploradores (NPC 1)
  { x: 370, y: 470, width: 160, height: 30, area: 1 },
  // 2: Pilar de arenito do canyon
  { x: 570, y: 420, width: 130, height: 30, area: 1 },
  // 3: Elevador Magnético Alfa (Sobe veloz de y=440 a y=180!)
  { x: 740, y: 420, width: 115, height: 26, area: 2, elevator: true, baseY: 310, rangeY: 130, speed: 0.0022, guideTop: 160, guideBottom: 470 },
  // 4: Monólito do Cume do Canyon (NPC 2)
  { x: 890, y: 190, width: 170, height: 28, area: 2, elevated: true },
  // 5: Plataforma magnética deslizante rápida
  { x: 1100, y: 220, width: 110, height: 24, area: 2, moving: true, baseX: 1160, range: 85, speed: 0.0025 },
  // 6: Passagem da Tempestade Elétrica
  { x: 1290, y: 240, width: 140, height: 28, area: 2, suspended: true },
  // 7: Elevador de Descarga Beta (Sobe e desce pelo abismo)
  { x: 1470, y: 270, width: 115, height: 26, area: 3, elevator: true, baseY: 380, rangeY: 120, speed: 0.002, guideTop: 240, guideBottom: 510 },
  // 8: Base do Canyon de Eletricidade (NPC 3)
  { x: 1630, y: 480, width: 180, height: 30, area: 3 },
  // 9: Pilar de salto estreito A
  { x: 1850, y: 430, width: 105, height: 28, area: 3, narrow: true },
  // 10: Plataforma de alta voltagem móvel
  { x: 1990, y: 380, width: 110, height: 24, area: 4, moving: true, baseX: 2045, range: 75, speed: 0.0024 },
  // 11: Pilar de salto estreito B
  { x: 2170, y: 330, width: 105, height: 28, area: 4, narrow: true },
  // 12: Elevador Tesla Vertical (Sobe de y=350 a y=150!)
  { x: 2315, y: 310, width: 115, height: 26, area: 4, elevator: true, baseY: 250, rangeY: 100, speed: 0.0021, guideTop: 130, guideBottom: 380 },
  // 13: Templo Flutuante de Delta (NPC 4)
  { x: 2470, y: 160, width: 170, height: 30, area: 4, elevated: true },
  // 14: Trilha de descida de arenito
  { x: 2680, y: 270, width: 120, height: 28, area: 5 },
  // 15: Pilar de ancoragem do vale
  { x: 2830, y: 410, width: 120, height: 28, area: 5 },
  // 16: Portal das Pirâmides Douradas (NPC 5 / Final)
  { x: 2980, y: 520, width: 240, height: 34, area: 5 },
];

/** Mundo 3: Mundo dos Mestres (Fortaleza Vulcânica & Forja de Lava) */
export const WORLD_3_PLATFORMS = [
  // 0: Base da fortaleza com Casa
  { x: 0, y: 520, width: 330, height: 34, area: 1 },
  // 1: Portão da Forja (NPC 1)
  { x: 370, y: 480, width: 160, height: 30, area: 1 },
  // 2: Pilar de basalto vulcânico
  { x: 570, y: 440, width: 130, height: 30, area: 1 },
  // 3: Plataforma flutuante de magma móvel
  { x: 740, y: 440, width: 110, height: 26, area: 1, moving: true, baseX: 795, range: 80, speed: 0.002 },
  // 4: Ilha de rocha vulcânica
  { x: 920, y: 420, width: 150, height: 30, area: 2 },
  // 5: Grande Elevador de Correntes da Forja (Sobe de y=420 até y=120!)
  { x: 1110, y: 390, width: 125, height: 26, area: 2, elevator: true, baseY: 270, rangeY: 150, speed: 0.0017, guideTop: 100, guideBottom: 450 },
  // 6: Parapeito das Torres Vulcânicas (NPC 2)
  { x: 1280, y: 140, width: 180, height: 30, area: 2, elevated: true },
  // 7: Rocha de cinzas suspensa
  { x: 1500, y: 170, width: 120, height: 26, area: 2, suspended: true },
  // 8: Elevador de Contrapeso Vulcânico (Sobe e desce entre as torres)
  { x: 1660, y: 220, width: 120, height: 26, area: 3, elevator: true, baseY: 300, rangeY: 110, speed: 0.002, guideTop: 170, guideBottom: 430 },
  // 9: Bastão Central de Basalto (NPC 3)
  { x: 1820, y: 430, width: 160, height: 30, area: 3 },
  // 10: Rocha vulcânica móvel A (oscilação rápida)
  { x: 2020, y: 400, width: 110, height: 26, area: 4, moving: true, baseX: 2075, range: 75, speed: 0.0026, phase: 0 },
  // 11: Rocha vulcânica móvel B (oposição de fase)
  { x: 2210, y: 350, width: 110, height: 26, area: 4, moving: true, baseX: 2265, range: 75, speed: 0.0026, phase: Math.PI },
  // 12: Elevador da Torre de Fogo (Sobe ao cume final)
  { x: 2400, y: 310, width: 120, height: 26, area: 4, elevator: true, baseY: 230, rangeY: 100, speed: 0.0022, guideTop: 110, guideBottom: 350 },
  // 13: Altar Supremo do Vulcão (NPC 4)
  { x: 2560, y: 150, width: 170, height: 30, area: 4, elevated: true },
  // 14: Passarela de descida estreita
  { x: 2760, y: 280, width: 110, height: 28, area: 5, narrow: true },
  // 15: Degrau final de cinzas
  { x: 2880, y: 420, width: 80, height: 28, area: 5, narrow: true },
  // 16: Trono do Castelo dos Mestres (NPC 5 / Final)
  { x: 2980, y: 520, width: 240, height: 34, area: 5 },
];

export const WORLD_PLATFORMS_MAP = {
  0: WORLD_0_PLATFORMS,
  1: WORLD_1_PLATFORMS,
  2: WORLD_2_PLATFORMS,
  3: WORLD_3_PLATFORMS,
};

/** Cria definições de plataformas para o mapa de um mundo com clones desacoplados. */
export function createWorldPlatforms(worldIndex = 0) {
  const layout = WORLD_PLATFORMS_MAP[worldIndex] || WORLD_0_PLATFORMS;
  return layout.map((plat) => ({
    ...plat,
    baseX: plat.baseX ?? plat.x,
    baseY: plat.baseY ?? plat.y,
    prevX: plat.x,
    prevY: plat.y,
    vx: 0,
    vy: 0,
  }));
}

/**
 * Atualiza o movimento lógico das plataformas móveis e elevadores verticais.
 * Calcula suas velocidades (vx, vy) para transferir momento suavemente ao jogador.
 */
export function updateWorldPlatforms(platforms, time) {
  for (const plat of platforms) {
    plat.prevX = plat.x;
    plat.prevY = plat.y;

    if (plat.moving) {
      const speed = plat.speed || 0.002;
      const phase = plat.phase || 0;
      plat.x = plat.baseX + Math.sin(time * speed + phase) * plat.range;
    }

    if (plat.elevator) {
      const speed = plat.speed || 0.0018;
      const phase = plat.phase || 0;
      plat.y = plat.baseY + Math.sin(time * speed + phase) * plat.rangeY;
    }

    plat.vx = plat.prevX !== undefined ? plat.x - plat.prevX : 0;
    plat.vy = plat.prevY !== undefined ? plat.y - plat.prevY : 0;
  }
}

// =============================================================================
// NPCS / FASES DE CADA MUNDO (Alinhados com a arquitetura de cada mapa)
// =============================================================================

export const WORLD_0_NPCS = [
  { phase: 1, platformIndex: 1, areaName: 'Entrada da Floresta', message: 'Bem-vindo! Sua jornada das equações começa aqui.' },
  { phase: 2, platformIndex: 5, areaName: 'Copa das Árvores', message: 'Excelente subida no elevador! Vamos ao discriminante.' },
  { phase: 3, platformIndex: 9, areaName: 'Vale Suspenso', message: 'Domine soma e produto para cruzar este vale!' },
  { phase: 4, platformIndex: 13, areaName: 'Passo do Vento', message: 'Bhaskara exige precisão nos saltos e nas contas!' },
  { phase: 5, platformIndex: 16, areaName: 'Castelo das Equações', message: 'Parabéns! Vença o Desafio Final para concluir este mundo!' },
];

export const WORLD_1_NPCS = [
  { phase: 1, platformIndex: 1, areaName: 'Cais da Praia', message: 'Bem-vindo ao Mundo dos Coeficientes! Identifique a, b e c.' },
  { phase: 2, platformIndex: 6, areaName: 'Ilha das Nuvens', message: 'O elevador gêiser te levou às nuvens! Aplique as relações de Vieta.' },
  { phase: 3, platformIndex: 11, areaName: 'Grande Recife', message: 'Cuidado com as jangadas! Equações incompletas à frente.' },
  { phase: 4, platformIndex: 15, areaName: 'Farol da Costa', message: 'Bhaskara II exige atenção plena nos sinais!' },
  { phase: 5, platformIndex: 17, areaName: 'Palácio Submerso', message: 'Você navegou como um mestre! Conquiste o Desafio Final!' },
];

export const WORLD_2_NPCS = [
  { phase: 1, platformIndex: 1, areaName: 'Entrada do Canyon', message: 'Cuidado! A energia do Delta percorre cada rocha aqui.' },
  { phase: 2, platformIndex: 4, areaName: 'Pico dos Raios', message: 'O elevador magnético te levou ao cume! Calcule o Delta positivo.' },
  { phase: 3, platformIndex: 8, areaName: 'Abismo da Corrente', message: 'Delta igual a zero tem raiz única! Pule com firmeza.' },
  { phase: 4, platformIndex: 13, areaName: 'Templo de Tesla', message: 'Delta negativo não tem raiz real! Domine a classificação.' },
  { phase: 5, platformIndex: 16, areaName: 'Pirâmide de Ouro', message: 'Chegamos ao ápice do Delta! Conclua o Desafio Final!' },
];

export const WORLD_3_NPCS = [
  { phase: 1, platformIndex: 1, areaName: 'Portão da Forja', message: 'Você entrou no Mundo dos Mestres! Resolva problemas aplicados.' },
  { phase: 2, platformIndex: 6, areaName: 'Torre de Basalto', message: 'O elevador de correntes suportou o magma! Coeficientes grandes agora.' },
  { phase: 3, platformIndex: 9, areaName: 'Núcleo de Lava', message: 'Foco total! As raízes inversas exigem raciocínio afiado.' },
  { phase: 4, platformIndex: 13, areaName: 'Cume do Vulcão', message: 'A miscelânea definitiva antes do castelo dos mestres!' },
  { phase: 5, platformIndex: 16, areaName: 'Trono do Grande Mestre', message: 'Chegou o Desafio Supremo! Vença e consagre-se como lenda!' },
];

export const WORLD_NPCS_MAP = {
  0: WORLD_0_NPCS,
  1: WORLD_1_NPCS,
  2: WORLD_2_NPCS,
  3: WORLD_3_NPCS,
};

/** Cria os cinco personagens que representam as fases do mundo. */
export function createWorldCharacters(platforms, worldIndex = 0, levelProgress = []) {
  const definitions = WORLD_NPCS_MAP[worldIndex] || WORLD_0_NPCS;

  return definitions.map((definition) => {
    const levelIndex = definition.phase - 1;
    const platformIndex = platforms[definition.platformIndex]
      ? definition.platformIndex
      : platforms.length - 1;
    const progress = levelProgress[levelIndex] || {};
    const character = {
      x: 0,
      y: 0,
      width: 30,
      height: 50,
      platformIndex,
      isGrounded: true,
      type: 'npc',
      levelIndex,
      phaseName: `Fase ${definition.phase}`,
      levelName: progress.levelName || `Fase ${levelIndex + 1}`,
      areaName: definition.areaName,
      message: definition.message,
      stars: progress.stars || 0,
      locked: progress.unlocked === false,
      color: ['#4CAF50', '#42A5F5', '#FFD54F', '#EF5350'][worldIndex % 4],
      activated: false,
    };
    alignCharacterToPlatform(character, platforms);
    return character;
  });
}

/**
 * Mantém a hitbox do NPC apoiada na superfície da plataforma que o ancora.
 */
export function alignCharacterToPlatform(character, platforms) {
  const platform = platforms[character.platformIndex];
  if (!platform) return character;

  character.x = platform.x + (platform.width - character.width) / 2;
  character.y = platform.y - character.height;
  character.isGrounded = true;
  return character;
}

export function alignCharactersToPlatforms(characters, platforms) {
  characters.forEach((character) => alignCharacterToPlatform(character, platforms));
}

// =============================================================================
// =============================================================================
// OBSTÁCULOS / ESPINHOS DE CADA MUNDO (Apoiados em plataformas estáticas)
// Espinhos não são colocados em plataformas especiais (móveis ou elevadores)
// e ficam firmemente apoiados sobre a superfície, sem flutuar no ar.
// =============================================================================

export const WORLD_0_HAZARDS = [
  // Área 1: Primeiro rochedo (Plataforma estática 2: x=600..750, y=440)
  { platformIndex: 2, offsetX: 55, x: 655, y: 422, width: 40, height: 18, type: 'spikes', area: 1 },
  // Área 2: Rota Alta - Copa das Árvores (Plataforma estática 4: x=970..1140, y=260)
  { platformIndex: 4, offsetX: 65, x: 1035, y: 242, width: 40, height: 18, type: 'spikes', area: 2 },
  // Área 2: Rota Baixa alternativa (Plataforma estática 6: x=960..1130, y=510)
  { platformIndex: 6, offsetX: 65, x: 1025, y: 492, width: 40, height: 18, type: 'spikes', area: 2 },
  // Área 2: Rota Baixa continuidade (Plataforma estática 7: x=1170..1320, y=470)
  { platformIndex: 7, offsetX: 55, x: 1225, y: 452, width: 40, height: 18, type: 'spikes', area: 2 },
  // Área 3: Reencontro das rotas (Plataforma estática 8: x=1410..1580, y=390)
  { platformIndex: 8, offsetX: 65, x: 1475, y: 372, width: 40, height: 18, type: 'spikes', area: 3 },
  // Área 4: Plataforma suspensa do penhasco (Plataforma estática 12: x=2260..2410, y=350)
  { platformIndex: 12, offsetX: 55, x: 2315, y: 332, width: 40, height: 18, type: 'spikes', area: 4 },
  // Área 5: Entrada do castelo (Plataforma estática 15: x=2840..2990, y=490)
  { platformIndex: 15, offsetX: 55, x: 2895, y: 472, width: 40, height: 18, type: 'spikes', area: 5 },
];

export const WORLD_1_HAZARDS = [
  // Área 1: Rochedo de coral marinho (Plataforma estática 2: x=560..700, y=450)
  { platformIndex: 2, offsetX: 52, x: 612, y: 432, width: 36, height: 18, type: 'spikes', area: 1 },
  // Área 2: Ilhota de conchas (Plataforma estática 4: x=920..1060, y=460)
  { platformIndex: 4, offsetX: 52, x: 972, y: 442, width: 36, height: 18, type: 'spikes', area: 2 },
  // Área 2: Passarela aérea de nuvens (Plataforma estática 7: x=1490..1620, y=220)
  { platformIndex: 7, offsetX: 48, x: 1538, y: 202, width: 34, height: 18, type: 'spikes', area: 2 },
  // Área 2: Cais inferior alternativo (Plataforma estática 9: x=1280..1430, y=500)
  { platformIndex: 9, offsetX: 58, x: 1338, y: 482, width: 34, height: 18, type: 'spikes', area: 2 },
  // Área 5: Ponte suspensa de cordas e corais (Plataforma estática 16: x=2800..2940, y=420)
  { platformIndex: 16, offsetX: 52, x: 2852, y: 402, width: 36, height: 18, type: 'spikes', area: 5 },
];

export const WORLD_2_HAZARDS = [
  // Área 1: Pilar de arenito do canyon (Plataforma estática 2: x=570..700, y=420)
  { platformIndex: 2, offsetX: 48, x: 618, y: 402, width: 34, height: 18, type: 'spikes', area: 1 },
  // Área 2: Passagem da Tempestade Elétrica (Plataforma estática 6: x=1290..1430, y=240)
  { platformIndex: 6, offsetX: 52, x: 1342, y: 222, width: 36, height: 18, type: 'spikes', area: 2 },
  // Área 3: Pilar de salto estreito A (Plataforma estática 9: x=1850..1955, y=430)
  { platformIndex: 9, offsetX: 38, x: 1888, y: 412, width: 28, height: 18, type: 'spikes', area: 3 },
  // Área 4: Pilar de salto estreito B (Plataforma estática 11: x=2170..2275, y=330)
  { platformIndex: 11, offsetX: 38, x: 2208, y: 312, width: 28, height: 18, type: 'spikes', area: 4 },
  // Área 5: Trilha de descida de arenito (Plataforma estática 14: x=2680..2800, y=270)
  { platformIndex: 14, offsetX: 44, x: 2724, y: 252, width: 32, height: 18, type: 'spikes', area: 5 },
  // Área 5: Pilar de ancoragem do vale (Plataforma estática 15: x=2830..2950, y=410)
  { platformIndex: 15, offsetX: 44, x: 2874, y: 392, width: 32, height: 18, type: 'spikes', area: 5 },
];

export const WORLD_3_HAZARDS = [
  // Área 1: Pilar de basalto vulcânico (Plataforma estática 2: x=570..700, y=440)
  { platformIndex: 2, offsetX: 48, x: 618, y: 422, width: 34, height: 18, type: 'spikes', area: 1 },
  // Área 2: Ilha de rocha vulcânica (Plataforma estática 4: x=920..1070, y=420)
  { platformIndex: 4, offsetX: 55, x: 975, y: 402, width: 40, height: 18, type: 'spikes', area: 2 },
  // Área 2: Rocha de cinzas suspensa (Plataforma estática 7: x=1500..1620, y=170)
  { platformIndex: 7, offsetX: 44, x: 1544, y: 152, width: 32, height: 18, type: 'spikes', area: 2 },
  // Área 5: Passarela de descida estreita (Plataforma estática 14: x=2760..2870, y=280)
  { platformIndex: 14, offsetX: 40, x: 2800, y: 262, width: 30, height: 18, type: 'spikes', area: 5 },
  // Área 5: Degrau final de cinzas (Plataforma estática 15: x=2880..2960, y=420)
  { platformIndex: 15, offsetX: 28, x: 2908, y: 402, width: 24, height: 18, type: 'spikes', area: 5 },
];

export const WORLD_HAZARDS_MAP = {
  0: WORLD_0_HAZARDS,
  1: WORLD_1_HAZARDS,
  2: WORLD_2_HAZARDS,
  3: WORLD_3_HAZARDS,
};

/** Obstáculos do percurso dos mundos devidamente alinhados a plataformas não especiais. */
export function createWorldHazards(worldIndex = 0, platforms = null) {
  const platList = platforms || WORLD_PLATFORMS_MAP[worldIndex] || WORLD_0_PLATFORMS;
  const hazards = WORLD_HAZARDS_MAP[worldIndex] || WORLD_0_HAZARDS;

  return hazards
    .filter((h) => {
      if (h.platformIndex !== undefined && platList[h.platformIndex]) {
        const plat = platList[h.platformIndex];
        // Nunca permitir espinhos em plataformas especiais (móveis ou elevadores)
        if (plat.elevator || plat.moving) return false;
      }
      return true;
    })
    .map((h) => {
      const hazard = { ...h };
      if (hazard.platformIndex !== undefined && platList[hazard.platformIndex]) {
        const plat = platList[hazard.platformIndex];
        // Garante apoio milimétrico sobre a superfície da plataforma
        hazard.y = plat.y - (hazard.height || 18);
        if (hazard.offsetX !== undefined) {
          hazard.x = plat.x + hazard.offsetX;
        }
      }
      return hazard;
    });
}

// =============================================================================
// RENDERIZAÇÃO ESTILIZADA DE PLATAFORMAS, ELEVADORES E PERIGOS
// =============================================================================

/**
 * Desenha uma plataforma com visual temático exclusivo do mundo atual,
 * renderizando trilhos, cabos de suspensão e painéis de elevadores verticais.
 */
export function drawPlatform(ctx, plat, cameraX, cameraY, worldIndex = 0) {
  const x = plat.x - cameraX;
  const y = plat.y - cameraY;

  // Otimização: descarte se estiver fora da tela
  if (x + plat.width < -120 || x > ctx.canvas.width + 120) return;

  // --- 1. Trilhos e Cabos de Guias para Elevadores Verticais ---
  if (plat.elevator) {
    const guideTop = (plat.guideTop ?? (plat.baseY - plat.rangeY - 30)) - cameraY;
    const guideBottom = (plat.guideBottom ?? (plat.baseY + plat.rangeY + 40)) - cameraY;

    ctx.save();
    if (worldIndex === 2) {
      // Elevador elétrico: cabos duplos de cobre com aura luminosa
      ctx.strokeStyle = '#FFE082';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 16, guideTop);
      ctx.lineTo(x + 16, guideBottom);
      ctx.moveTo(x + plat.width - 16, guideTop);
      ctx.lineTo(x + plat.width - 16, guideBottom);
      ctx.stroke();

      // Núcleo de energia azul elétrico
      ctx.strokeStyle = '#40C4FF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Suportes de parede
      ctx.fillStyle = '#FFA000';
      ctx.fillRect(x + 11, guideTop - 6, 10, 8);
      ctx.fillRect(x + plat.width - 21, guideTop - 6, 10, 8);
      ctx.fillRect(x + 11, guideBottom - 2, 10, 8);
      ctx.fillRect(x + plat.width - 21, guideBottom - 2, 10, 8);
    } else if (worldIndex === 3) {
      // Elevador vulcânico: correntes de ferro fundido pesadas
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 18, guideTop);
      ctx.lineTo(x + 18, guideBottom);
      ctx.moveTo(x + plat.width - 18, guideTop);
      ctx.lineTo(x + plat.width - 18, guideBottom);
      ctx.stroke();

      // Elos da corrente
      ctx.fillStyle = '#D84315';
      for (let cy = guideTop; cy < guideBottom; cy += 12) {
        ctx.fillRect(x + 15, cy, 6, 4);
        ctx.fillRect(x + plat.width - 21, cy, 6, 4);
      }
    } else if (worldIndex === 1) {
      // Elevador marítimo: colunas de coral & cabos náuticos azuis
      ctx.strokeStyle = '#00838F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 16, guideTop);
      ctx.lineTo(x + 16, guideBottom);
      ctx.moveTo(x + plat.width - 16, guideTop);
      ctx.lineTo(x + plat.width - 16, guideBottom);
      ctx.stroke();

      // Roldanas de concha
      ctx.fillStyle = '#80DEEA';
      ctx.beginPath();
      ctx.arc(x + 16, guideTop, 6, 0, Math.PI * 2);
      ctx.arc(x + plat.width - 16, guideTop, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Elevador da floresta: cabos de corda rústicos com roldanas de madeira
      ctx.strokeStyle = '#795548';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 16, guideTop);
      ctx.lineTo(x + 16, guideBottom);
      ctx.moveTo(x + plat.width - 16, guideTop);
      ctx.lineTo(x + plat.width - 16, guideBottom);
      ctx.stroke();

      // Roldanas de topo
      ctx.fillStyle = '#5D4037';
      ctx.beginPath();
      ctx.arc(x + 16, guideTop, 6, 0, Math.PI * 2);
      ctx.arc(x + plat.width - 16, guideTop, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- 2. Trilhos / Correntes para Plataformas Horizontais Móveis ou Suspensas ---
  if (plat.suspended && !plat.elevator) {
    ctx.save();
    ctx.strokeStyle = worldIndex === 3 ? '#1A1A1A' : worldIndex === 2 ? '#B5651D' : '#6D4C41';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 48);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x + plat.width - 18, y - 48);
    ctx.lineTo(x + plat.width - 18, y);
    ctx.stroke();
    for (let chainY = y - 44; chainY < y - 4; chainY += 9) {
      ctx.fillStyle = worldIndex === 3 ? '#BF360C' : worldIndex === 2 ? '#FFD54F' : '#A1887F';
      ctx.fillRect(x + 15, chainY, 6, 4);
      ctx.fillRect(x + plat.width - 21, chainY, 6, 4);
    }
    ctx.restore();
  }

  if (plat.moving && !plat.elevator) {
    // Guia ou trilho horizontal discreto no fundo
    ctx.save();
    const trackLeft = plat.baseX - plat.range - cameraX;
    const trackRight = plat.baseX + plat.range + plat.width - cameraX;
    ctx.strokeStyle = worldIndex === 3 ? 'rgba(255, 87, 34, 0.4)' : worldIndex === 2 ? 'rgba(255, 213, 79, 0.5)' : worldIndex === 1 ? 'rgba(0, 188, 212, 0.4)' : 'rgba(121, 85, 72, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(trackLeft, y + plat.height / 2);
    ctx.lineTo(trackRight, y + plat.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // --- 3. Renderização Temática do Corpo e Borda da Plataforma ---
  ctx.save();

  if (worldIndex === 1) {
    // ================= MUNDO 1: COSTA & CORAIS MARINHOS =================
    // Corpo: Rocha oceânica / Madeira salina
    const woodGrad = ctx.createLinearGradient(x, y + 6, x, y + plat.height);
    woodGrad.addColorStop(0, '#00838F');
    woodGrad.addColorStop(1, '#006064');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(x, y + 6, plat.width, plat.height - 6);

    // Superfície de corais e algas turquesa
    const coralGrad = ctx.createLinearGradient(x, y, x, y + 10);
    coralGrad.addColorStop(0, '#4DD0E1');
    coralGrad.addColorStop(1, '#00ACC1');
    ctx.fillStyle = coralGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, plat.width, 10, [4, 4, 0, 0]);
    ctx.fill();

    // Detalhes de conchas / bioluminescência
    ctx.fillStyle = '#80DEEA';
    for (let i = 0; i < plat.width; i += 24) {
      ctx.fillRect(x + i + 6, y + 14, 6, 3);
    }
  } else if (worldIndex === 2) {
    // ================= MUNDO 2: CANYON & TEMPLO ELÉTRICO =================
    // Corpo: Arenito avermelhado do deserto
    const sandGrad = ctx.createLinearGradient(x, y + 6, x, y + plat.height);
    sandGrad.addColorStop(0, '#E65100');
    sandGrad.addColorStop(1, '#BF360C');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(x, y + 6, plat.width, plat.height - 6);

    // Topo de arenito dourado com bordas energizadas
    const goldGrad = ctx.createLinearGradient(x, y, x, y + 10);
    goldGrad.addColorStop(0, '#FFE082');
    goldGrad.addColorStop(1, '#FFA000');
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, plat.width, 10, [4, 4, 0, 0]);
    ctx.fill();

    // Linhas de circuito elétrico amarelo neon
    ctx.fillStyle = '#FFF59D';
    for (let i = 0; i < plat.width; i += 22) {
      ctx.fillRect(x + i + 4, y + 15, 8, 2);
    }
  } else if (worldIndex === 3) {
    // ================= MUNDO 3: FORTALEZA VULCÂNICA & MAGMA =================
    // Corpo: Basalto negro vulcânico
    ctx.fillStyle = '#212121';
    ctx.fillRect(x, y + 6, plat.width, plat.height - 6);

    // Topo de pedra com fendas de lava incandescente
    const lavaGrad = ctx.createLinearGradient(x, y, x, y + 10);
    lavaGrad.addColorStop(0, '#FF5722');
    lavaGrad.addColorStop(1, '#BF360C');
    ctx.fillStyle = lavaGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, plat.width, 10, [4, 4, 0, 0]);
    ctx.fill();

    // Fendas ardentes
    ctx.fillStyle = '#FFEB3B';
    for (let i = 0; i < plat.width; i += 20) {
      ctx.fillRect(x + i + 5, y + 15, 8, 3);
    }
  } else {
    // ================= MUNDO 0: FLORESTA & GRAMA =================
    // Terra fértil
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x, y + 6, plat.width, plat.height - 6);

    // Grama viçosa
    const grassGrad = ctx.createLinearGradient(x, y, x, y + 10);
    grassGrad.addColorStop(0, '#4CAF50');
    grassGrad.addColorStop(1, '#388E3C');
    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, plat.width, 10, [4, 4, 0, 0]);
    ctx.fill();

    // Textura de terra
    ctx.fillStyle = '#7A5B1A';
    for (let i = 0; i < plat.width; i += 20) {
      ctx.fillRect(x + i + 5, y + 15, 8, 3);
    }
  }

  // --- 4. Painel Indicador de Elevador (Setas animadas ▲ / ▼) ---
  if (plat.elevator) {
    const isGoingUp = (plat.vy || 0) < 0;
    const arrowY = y + 15;
    const arrowX = x + plat.width / 2;

    // Placa metálica central do elevador
    ctx.fillStyle = worldIndex === 3 ? '#263238' : worldIndex === 2 ? '#37474F' : '#ECEFF1';
    ctx.strokeStyle = worldIndex === 3 ? '#FF5722' : worldIndex === 2 ? '#FFD54F' : '#90A4AE';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(arrowX - 16, y + 3, 32, plat.height - 6, 4);
    ctx.fill();
    ctx.stroke();

    // Seta animada
    ctx.fillStyle = isGoingUp ? '#00E676' : '#FFD600';
    ctx.beginPath();
    if (isGoingUp) {
      // Seta para cima ▲
      ctx.moveTo(arrowX, arrowY - 4);
      ctx.lineTo(arrowX - 6, arrowY + 4);
      ctx.lineTo(arrowX + 6, arrowY + 4);
    } else {
      // Seta para baixo ▼
      ctx.moveTo(arrowX, arrowY + 4);
      ctx.lineTo(arrowX - 6, arrowY - 4);
      ctx.lineTo(arrowX + 6, arrowY - 4);
    }
    ctx.fill();
  }

  // Destaque de rotas alternativas / plataformas estreitas
  if (plat.narrow || plat.alternate) {
    ctx.fillStyle = plat.alternate ? '#81C784' : '#66BB6A';
    ctx.fillRect(x + 8, y - 2, Math.max(10, plat.width - 16), 3);
  }

  ctx.restore();
}

/** Desenha espinhos e perigos com temática visual do mundo. */
export function drawHazard(ctx, hazard, cameraX, cameraY, worldIndex = 0) {
  const x = hazard.x - cameraX;
  const y = hazard.y - cameraY;
  const spikes = Math.max(1, Math.floor(hazard.width / 14));

  ctx.save();
  if (worldIndex === 2) {
    // Espinhos elétricos
    ctx.fillStyle = '#FFD600';
    ctx.strokeStyle = '#FF6D00';
  } else if (worldIndex === 3) {
    // Espinhos de magma
    ctx.fillStyle = '#FF3D00';
    ctx.strokeStyle = '#BF360C';
  } else if (worldIndex === 1) {
    // Ouriços / corais afiados
    ctx.fillStyle = '#E91E63';
    ctx.strokeStyle = '#880E4F';
  } else {
    // Espinhos tradicionais de ferro
    ctx.fillStyle = '#E53935';
    ctx.strokeStyle = '#8E2020';
  }

  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < spikes; i += 1) {
    const left = x + i * (hazard.width / spikes);
    const right = x + (i + 1) * (hazard.width / spikes);
    const mid = (left + right) / 2;
    ctx.moveTo(left, y + hazard.height);
    ctx.lineTo(mid, y);
    ctx.lineTo(right, y + hazard.height);
  }
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** NPCs do mapa atual com cabeça triangular e balão de diálogo estilizado. */
export function drawNPC(ctx, npc, cameraX, cameraY, frame) {
  const x = npc.x - cameraX + npc.width / 2;
  const y = npc.y - cameraY;
  const bobY = Math.sin(frame * 0.05) * 3;
  const message = npc.message || 'Prepare-se!';
  const bubbleWidth = Math.min(260, Math.max(170, message.length * 5.2));
  const bubbleHeight = message.length > 34 ? 58 : 44;

  ctx.save();
  ctx.strokeStyle = npc.color || '#555';
  ctx.fillStyle = npc.locked ? 'rgba(70,70,70,0.8)' : '#FFFDF2';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  // Cabeça triangular expressiva
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 9, y + 15);
  ctx.lineTo(x + 9, y + 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = npc.color || '#455A64';
  ctx.beginPath();
  ctx.arc(x - 2.5, y + 8, 1.7, 0, Math.PI * 2);
  ctx.arc(x + 2.5, y + 8, 1.7, 0, Math.PI * 2);
  ctx.fill();

  // Corpo em stick figure
  ctx.beginPath();
  ctx.moveTo(x, y + 15); ctx.lineTo(x, y + 34);
  ctx.moveTo(x, y + 22); ctx.lineTo(x - 11, y + 28);
  ctx.moveTo(x, y + 22); ctx.lineTo(x + 11, y + 28);
  ctx.moveTo(x, y + 34); ctx.lineTo(x - 7, y + npc.height);
  ctx.moveTo(x, y + 34); ctx.lineTo(x + 7, y + npc.height);
  ctx.stroke();

  // Balão sempre visível no mapa
  ctx.fillStyle = npc.locked ? 'rgba(35,35,35,0.9)' : 'rgba(255,253,242,0.96)';
  ctx.beginPath();
  ctx.roundRect(x - bubbleWidth / 2, y - 58 + bobY, bubbleWidth, bubbleHeight, 10);
  ctx.fill();
  ctx.strokeStyle = npc.color || '#78909C';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 7, y - 10 + bobY);
  ctx.lineTo(x, y - 3 + bobY);
  ctx.lineTo(x + 7, y - 10 + bobY);
  ctx.fill();

  ctx.fillStyle = npc.locked ? '#FFD54F' : '#2D3A2E';
  ctx.textAlign = 'center';
  ctx.font = 'bold 10px Patrick Hand, sans-serif';
  ctx.fillText(npc.phaseName || `Fase ${npc.levelIndex + 1}`, x, y - 42 + bobY);
  ctx.font = '11px Patrick Hand, sans-serif';
  const words = message.split(' ');
  let line = '';
  const lines = [];
  words.forEach((word) => {
    const next = `${line} ${word}`.trim();
    if (ctx.measureText(next).width > bubbleWidth - 18) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((text, index) => ctx.fillText(text, x, y - 25 + index * 13 + bobY));
  ctx.restore();
}
