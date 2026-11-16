export const FRAGMENTS = [
  { id: 'seiva', name: 'Seiva da Soma', world: 0, level: 2 },
  { id: 'equilibrio', name: 'Equilíbrio da Diferença', world: 0, level: 4 },
  { id: 'luz', name: 'Luz dos Produtos', world: 1, level: 2 },
  { id: 'fatores', name: 'Laço dos Fatores', world: 1, level: 4 },
  { id: 'partes', name: 'Harmonia das Partes', world: 2, level: 4 },
  { id: 'incognita', name: 'Chave da Incógnita', world: 3, level: 4 },
  { id: 'formas', name: 'Essência das Formas', world: 4, level: 3 },
];
// Derived from passed levels: replays never duplicate fragments; online stars restore them.
export const recoveredFragments = (state) => FRAGMENTS.filter(f => state.levelStars?.[f.world]?.[f.level] > 0);
export const isStoryComplete = (state) => recoveredFragments(state).length === 7 && state.levelStars?.[4]?.[4] > 0;
export const WORLD_DIALOGUES = [
  'Léo, as pontes esqueceram como unir suas partes. Some para reconstruir e subtraia para retirar os bloqueios. O Goblin guarda duas energias do Coração.',
  'Os cristais crescem em grupos iguais. Use a multiplicação para acendê-los. A Aranha dos Fatores teceu sua teia ao redor de mais dois fragmentos.',
  'Cada grão pertence a um todo. Simplifique e compare frações para equilibrar as ruínas. O Escorpião Decimal protege o quinto fragmento.',
  'Uma incógnita é um valor que ainda vamos descobrir. Mantenha os dois lados em equilíbrio. Mestre X guarda a chave para o último reino.',
  'Áreas, perímetros e formas sustentam estas ilhas. O santuário guarda o sétimo fragmento. Reúna todos antes de enfrentar Zero Absoluto.',
];
export const INTRO = [
  ['Numeria', 'Antes do silêncio', 'Em Numeria, rios desenhavam curvas, montanhas mantinham suas formas e o tempo seguia seu compasso.'],
  ['Narrador', 'O Templo dos Números', 'No centro do mundo, o Coração dos Cálculos mantinha cada medida, cada soma e cada instante em harmonia.'],
  ['Zero Absoluto', 'A invasão', 'Toda ordem tem um ponto fraco. Quando eu apagar os números, nada poderá me deter!'],
  ['Narrador', 'Sete luzes no escuro', 'Zero Absoluto partiu o Coração em sete fragmentos. Sua luz se espalhou pelos cinco reinos.'],
  ['Narrador', 'Um mundo sem respostas', 'As somas falharam. As medidas se perderam. Pontes surgiam e desapareciam, e os rios já não encontravam o mar.'],
  ['Léo', 'O aprendiz explorador', 'Se os caminhos viraram enigmas, vou aprender a decifrá-los. Numeria ainda tem solução!'],
  ['Mestra Álgebra', 'Uma missão começa', 'Léo, recupere os sete fragmentos. Use o que aprender para restaurar cada reino. Eu estarei ao seu lado.'],
];
export const ENDING = [
  ['Zero Absoluto', 'O último cálculo', 'Como…? Mesmo separados, vocês encontraram uma forma de se unir.'],
  ['Narrador', 'O Coração desperta', 'Os sete fragmentos voltam a pulsar juntos. As pontes se firmam, os rios retomam seus cursos e Numeria floresce.'],
  ['Mestra Álgebra', 'Guardião dos Números', 'Sua coragem abriu o caminho, Léo. Sua curiosidade o manteve em frente. Numeria tem um novo Guardião dos Números!'],
  ['Léo', 'Uma aventura que continua', 'A matemática não é apenas números. Ela é a linguagem que ajuda a entender e transformar o mundo.'],
];
export const BOSS_TAUNTS = ['Vou embaralhar suas somas!', 'Nem todos os fios são iguais. Encontre meus fatores!', 'Consegue enxergar o todo por trás das partes?', 'Descubra meu X, se puder!', 'Sem números, seu caminho termina aqui!'];
export const FINAL_TOPICS = ['Adição e subtração', 'Multiplicação', 'Frações', 'Álgebra', 'Geometria', 'A união dos conhecimentos'];
