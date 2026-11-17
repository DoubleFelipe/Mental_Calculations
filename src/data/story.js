// Narrative content only. Worlds, questions, rewards and unlocks remain in their existing modules.
export const FRAGMENTS = [
  { id: 'roots', name: 'Raízes', world: 0, level: 1, effect: 'As árvores voltam a se firmar no solo. A floresta reconhece seu primeiro passo.' },
  { id: 'balance', name: 'Equilíbrio', world: 0, level: 4, effect: 'As pontes da floresta recuperam sua forma. A costa chama por Léo: há novos fragmentos a encontrar!' },
  { id: 'tides', name: 'Marés', world: 1, level: 1, effect: 'As águas reencontram seu curso. As ilhas deixam de se perder no horizonte.' },
  { id: 'beacon', name: 'Orientação', world: 1, level: 4, effect: 'O farol ilumina o canyon. Uma sombra observa Léo do outro lado das montanhas.' },
  { id: 'spark', name: 'Centelha', world: 2, level: 1, effect: 'Os raios voltam a seguir um ritmo. Zero Absoluto já percebeu a força do seu raciocínio.' },
  { id: 'harmony', name: 'Harmonia', world: 2, level: 4, effect: 'O canyon recupera sua energia. Zero Absoluto recua para o castelo dos mestres.' },
  { id: 'courage', name: 'Coragem', world: 3, level: 3, effect: 'O sétimo fragmento desperta! Agora Léo pode reunir o Coração no confronto do Desafio Supremo.' },
];

export const INTRO_SCENES = [
  { speaker: 'Mestra Álgebra', title: 'Bem-vindo a Numeria', text: 'Em Numeria, o Coração dos Cálculos sustenta a realidade: os rios seguem seus cursos, as montanhas mantêm suas formas e o tempo avança.' },
  { speaker: 'Zero Absoluto', title: 'A noite no Templo dos Números', text: 'Uma figura misteriosa invadiu o templo e partiu o Coração em sete fragmentos. Agora as somas falham, as medidas se confundem e pontes aparecem e desaparecem.' },
  { speaker: 'Léo', title: 'Um aprendiz, uma missão', text: 'Sou Léo, aprendiz e explorador de enigmas. Mestra, vou encontrar os fragmentos antes que Numeria mergulhe no caos!' },
  { speaker: 'Mestra Álgebra', title: 'A aventura começa', text: 'Converse com os guardiões dos quatro mundos e resolva seus desafios. Cada conquista nos aproxima dos sete fragmentos. Seu raciocínio pode transformar Numeria!' },
];

export const WORLD_STORIES = [
  { title: 'A floresta sem raízes', objective: 'Ajude os guardiões a estabilizar a floresta e recuperar os fragmentos de Raízes e Equilíbrio.', threat: 'Uma sombra passou pelo castelo. Ninguém sabe ainda quem se esconde sob o manto.', levels: [
    'As raízes da floresta perderam seus caminhos. Comece pelas raízes simples e ajude Léo a encontrar uma direção.',
    'As copas tremem com a ruptura do Coração. O discriminante guarda a pista do fragmento de Raízes.',
    'O vale perdeu seu equilíbrio. As relações entre soma e produto ajudam a compreender o caminho.',
    'O vento espalhou as pistas. Reúna seu conhecimento de Bhaskara antes de chegar ao castelo.',
    'O fragmento de Equilíbrio está no castelo. Supere o desafio que o guardião já preparou para você.',
  ] },
  { title: 'O segredo das marés', objective: 'Investigue a costa e resgate os fragmentos de Marés e Orientação.', threat: 'A sombra tem um nome: Zero Absoluto. Ele tenta apagar as relações que mantêm o oceano em ordem.', levels: [
    'A costa perdeu suas referências. Reconhecer a, b e c é o primeiro passo desta investigação.',
    'As ilhas estão à deriva. As relações de Vieta indicam onde repousa o fragmento de Marés.',
    'Há pistas incompletas no recife. Explore as equações incompletas para seguir adiante.',
    'O farol está cercado de névoa. Use Bhaskara para decifrar as pistas deixadas na costa.',
    'O palácio submerso abriga o fragmento de Orientação. Seu desafio levará a aventura ao canyon.',
  ] },
  { title: 'Ecos no canyon', objective: 'Explore os sinais de Δ e recupere os fragmentos de Centelha e Harmonia.', threat: 'Zero Absoluto: “Vocês nunca reunirão o Coração. Até as montanhas vão esquecer suas formas!”', levels: [
    'Os raios confundem as trilhas. Explore o Delta positivo e procure as primeiras pistas do canyon.',
    'No pico, a tempestade cerca o fragmento de Centelha. Investigue o que acontece quando Delta é zero.',
    'A sombra de Zero Absoluto cruza o abismo. Entenda o Delta negativo para prosseguir na investigação.',
    'O templo guarda registros das raízes. Classifique os casos e prepare a chegada à pirâmide.',
    'O fragmento de Harmonia pulsa na pirâmide. Este desafio revelará o caminho ao refúgio de Zero Absoluto.',
  ] },
  { title: 'O retorno ao Coração', objective: 'Recupere Coragem na quarta fase e enfrente Zero Absoluto no Desafio Supremo.', threat: 'Zero Absoluto espera no castelo. Léo precisará de tudo o que aprendeu nos outros mundos.', levels: [
    'Na forja, o conhecimento encontra o mundo real. Resolva os problemas aplicados e aproxime-se do castelo.',
    'Zero Absoluto espalhou símbolos pela torre. Encare os coeficientes grandes sem perder a atenção.',
    'O núcleo guarda pistas invertidas. Explore as raízes inversas e siga o chamado do último fragmento.',
    'O fragmento de Coragem está no cume. Reúna seus conhecimentos na Miscelânea antes do confronto.',
    'Os sete fragmentos acompanham Léo até o trono. Cada resposta correta ilumina o Coração e enfraquece a sombra de Zero Absoluto.',
  ] },
];

export const ENDING_SCENES = [
  { speaker: 'Zero Absoluto', title: 'A sombra se desfaz', text: 'Como um aprendiz conseguiu...? As respostas de Léo atravessam a escuridão. Zero Absoluto é derrotado, e os sete fragmentos se aproximam.' },
  { speaker: 'Mestra Álgebra', title: 'O Coração volta a pulsar', text: 'O Coração dos Cálculos está restaurado! Os rios retomam seus cursos, as montanhas se firmam e o tempo volta a fluir em Numeria.' },
  { speaker: 'Léo', title: 'Guardião dos Números', text: 'Numeria reconhece Léo como Guardião dos Números. Crianças de todo o reino se inspiram na aventura para descobrir a Matemática. Ainda há muito para aprender e explorar!' },
  { speaker: 'Mestra Álgebra', title: 'O conhecimento transforma', text: 'A matemática não é apenas números. Ela é a linguagem que ajuda a entender e transformar o mundo.' },
];
