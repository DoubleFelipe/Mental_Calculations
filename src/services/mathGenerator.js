/**
 * Mental Calculations — Math Generator
 * Gera equações do 2º grau com diferentes dificuldades
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNumber(n) {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2).replace(/\.?0+$/, '');
}

function formatEquation(a, b, c) {
  let eq = '';
  if (a === 1) eq += 'x²';
  else if (a === -1) eq += '-x²';
  else eq += `${a}x²`;
  if (b > 0) eq += ` + ${b === 1 ? '' : b}x`;
  else if (b < 0) eq += ` - ${b === -1 ? '' : Math.abs(b)}x`;
  if (c > 0) eq += ` + ${c}`;
  else if (c < 0) eq += ` - ${Math.abs(c)}`;
  eq += ' = 0';
  return eq;
}

function generateEasyQuestion() {
  const r1 = randInt(-5, 5);
  const r2 = randInt(-5, 5);
  const a = 1, b = -(r1 + r2), c = r1 * r2;
  const delta = b * b - 4 * a * c;
  const roots = [r1, r2].sort((x, y) => x - y);
  const types = [
    {
      kind: 'roots',
      text: `Encontre as raízes da equação:\n${formatEquation(a, b, c)}`,
      correctAnswer: roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`,
      explanation: `Δ = ${b}² - 4·${a}·${c} = ${delta}\nx = (${-b} ± √${delta}) / ${2*a}\nx₁ = ${roots[0]}, x₂ = ${roots[1]}`,
    },
    {
      kind: 'discriminant',
      text: `Qual o discriminante (Δ) de:\n${formatEquation(a, b, c)}?`,
      correctAnswer: `Δ = ${delta}`,
      explanation: `Δ = b² - 4ac = (${b})² - 4·(${a})·(${c}) = ${delta}`,
    },
    {
      kind: 'sum',
      text: `Soma das raízes de:\n${formatEquation(a, b, c)}?`,
      correctAnswer: `S = ${r1 + r2}`,
      explanation: `S = -b/a = -(${b})/${a} = ${-b/a}`,
    },
  ];
  const chosen = types[randInt(0, types.length - 1)];
  return { a, b, c, delta, roots, ...chosen, difficulty: 'fácil' };
}

function generateMediumQuestion() {
  const a = randInt(1, 3), r1 = randInt(-6, 6), r2 = randInt(-6, 6);
  const b = -a * (r1 + r2), c = a * r1 * r2;
  const delta = b * b - 4 * a * c;
  const roots = [r1, r2].sort((x, y) => x - y);
  const types = [
    {
      kind: 'roots',
      text: `Resolva:\n${formatEquation(a, b, c)}`,
      correctAnswer: roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`,
      explanation: `Δ = ${delta}, x = (${-b} ± √${delta}) / ${2*a}`,
    },
    {
      kind: 'product',
      text: `Produto das raízes de:\n${formatEquation(a, b, c)}?`,
      correctAnswer: `P = ${formatNumber(c/a)}`,
      explanation: `P = c/a = ${c}/${a} = ${formatNumber(c/a)}`,
    },
    {
      kind: 'root-count',
      text: `Quantas raízes reais tem:\n${formatEquation(a, b, c)}?`,
      correctAnswer: delta > 0 ? '2 raízes reais distintas' : (delta === 0 ? '1 raiz real dupla' : 'Nenhuma raiz real'),
      explanation: `Δ = ${delta}. ${delta > 0 ? 'Δ > 0 → 2 raízes distintas' : delta === 0 ? 'Δ = 0 → raiz dupla' : 'Δ < 0 → sem raízes reais'}`,
    },
  ];
  const chosen = types[randInt(0, types.length - 1)];
  return { a, b, c, delta, roots, ...chosen, difficulty: 'médio' };
}

function generateHardQuestion() {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(1, 3);
    let b, c, delta;
    do { b = randInt(-8, 8); c = randInt(1, 20); delta = b*b - 4*a*c; } while (delta >= 0);
    return { a, b, c, delta, roots: [], kind: 'no-real-roots', text: `A equação ${formatEquation(a, b, c)} possui raízes reais?`, correctAnswer: 'Não possui raízes reais', explanation: `Δ = ${delta}. Como Δ < 0, não há raízes reais.`, difficulty: 'difícil' };
  } else if (type === 1) {
    const r1 = randInt(-7, 7), r2 = randInt(-7, 7), a = 1;
    const b = -a*(r1+r2), c = a*r1*r2;
    return { a, b, c, delta: b*b-4*a*c, roots: [r1,r2], kind: 'find-c', text: `Se as raízes são ${r1} e ${r2}, qual o valor de c?`, correctAnswer: `c = ${c}`, explanation: `P = c/a → c = ${r1} × ${r2} = ${c}`, difficulty: 'difícil' };
  } else {
    const a = randInt(2, 4), r1 = randInt(-8, 8), r2 = randInt(-8, 8);
    const b = -a*(r1+r2), c = a*r1*r2, delta = b*b-4*a*c;
    const roots = [r1,r2].sort((x,y)=>x-y);
    return { a, b, c, delta, roots, kind: 'roots', text: `Resolva:\n${formatEquation(a, b, c)}`, correctAnswer: roots[0]===roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`, explanation: `Δ = ${delta}, x = (${-b} ± √${delta}) / ${2*a}`, difficulty: 'difícil' };
  }
}

export function generateAlternatives(question) {
  const correct = question.correctAnswer;
  const alts = [correct];
  if (correct.includes('x₁') || correct.startsWith('x =')) {
    const r = question.roots;
    const seen = new Set([correct]);
    while (alts.length < 4) {
      const o1 = randInt(-3,3)||1, o2 = randInt(-3,3)||-1;
      const w1 = (r[0]||0)+o1, w2 = (r.length>1?r[1]:r[0]||0)+o2;
      const s = r.length<=1||r[0]===r[1] ? `x = ${w1}` : `x₁ = ${Math.min(w1,w2)} e x₂ = ${Math.max(w1,w2)}`;
      if (!seen.has(s)) { seen.add(s); alts.push(s); }
    }
  } else if (correct.includes('Δ')) {
    const d = question.delta;
    [d+4, d-8, d+12].forEach(v => alts.push(`Δ = ${v}`));
  } else if (correct.includes('raízes reais') || correct.includes('Não possui')) {
    ['2 raízes reais distintas','1 raiz real dupla','Não possui raízes reais','Infinitas raízes'].filter(o=>o!==correct).slice(0,3).forEach(o=>alts.push(o));
  } else {
    const m = correct.match(/-?\d+\.?\d*/);
    const v = m ? parseFloat(m[0]) : 0;
    const lbl = correct.split('=')[0].trim();
    [v+2, v-3, v+5].forEach(n => alts.push(`${lbl} = ${formatNumber(n)}`));
  }
  return shuffle(alts.slice(0, 4));
}

export function generateQuestion(difficulty = 'easy') {
  let q;
  if (difficulty === 'easy') q = generateEasyQuestion();
  else if (difficulty === 'medium') q = generateMediumQuestion();
  else q = generateHardQuestion();
  const alts = generateAlternatives(q);
  return { ...q, ...buildCoaching(q), alternatives: alts, correctIndex: alts.indexOf(q.correctAnswer) };
}

function buildCoaching(q) {
  const { a, b, c, delta, roots = [], kind } = q;
  const equation = formatEquation(a, b, c);
  const skills = {
    roots: ['Caçador de raízes', 'Aplicar Bhaskara e conferir as soluções'],
    discriminant: ['Radar do Δ', 'Calcular o discriminante sem perder os sinais'],
    sum: ['Atalho de Viète', 'Encontrar a soma das raízes sem resolver tudo'],
    product: ['Atalho de Viète', 'Encontrar o produto das raízes usando c/a'],
    'root-count': ['Leitor do Δ', 'Prever quantas raízes reais existem'],
    'no-real-roots': ['Detector de raízes', 'Usar o sinal do Δ para decidir se há raízes reais'],
    'find-c': ['Engenheiro reverso', 'Reconstruir o termo c a partir das raízes'],
  };
  const [skill, payoff] = skills[kind] || skills.roots;
  let steps;
  let takeaway;

  if (kind === 'roots') {
    steps = [
      `Identifique os coeficientes em ${equation}: a = ${a}, b = ${b}, c = ${c}. Primeiro, confira os sinais.`,
      `Calcule o discriminante: Δ = b² − 4ac = (${b})² − 4·(${a})·(${c}) = ${delta}.`,
      `Agora use x = (−b ± √Δ)/(2a): x = (${-b} ± √${delta})/${2 * a}.`,
      roots.length === 1 || roots[0] === roots[1]
        ? `As duas contas coincidem: x = ${roots[0]}. Essa é uma raiz dupla.`
        : `Separe os sinais: x₁ = ${roots[0]} e x₂ = ${roots[1]}. Substituir na equação confirma as duas raízes.`,
    ];
    takeaway = 'Quando pedirem as raízes, o roteiro é: identificar a, b e c → calcular Δ → aplicar Bhaskara → conferir.';
  } else if (kind === 'discriminant') {
    steps = [
      `Na equação ${equation}, a = ${a}, b = ${b} e c = ${c}.`,
      `A fórmula do radar é Δ = b² − 4ac. Coloque parênteses nos coeficientes para não perder sinais.`,
      `Δ = (${b})² − 4·(${a})·(${c}) = ${b * b} ${(-4 * a * c < 0 ? '−' : '+')} ${Math.abs(4 * a * c)} = ${delta}.`,
    ];
    takeaway = 'O discriminante é o primeiro passo de Bhaskara e também prevê quantas raízes reais a equação tem.';
  } else if (kind === 'sum') {
    const sum = roots.reduce((total, root) => total + root, 0);
    steps = [
      `A missão pede a soma das raízes de ${equation}. Não precisamos resolver a equação inteira.`,
      `Pela relação de Viète, S = −b/a. Atenção: o sinal de b troca.`,
      `S = −(${b})/${a} = ${formatNumber(sum)}.`,
    ];
    takeaway = 'Para achar só a soma, use −b/a e poupe a fórmula de Bhaskara.';
  } else if (kind === 'product') {
    steps = [
      `A missão pede o produto das raízes de ${equation}.`,
      `Pela relação de Viète, P = c/a.`,
      `P = ${c}/${a} = ${formatNumber(c / a)}.`,
    ];
    takeaway = 'Para achar só o produto, use c/a; não é preciso calcular Δ.';
  } else if (kind === 'root-count' || kind === 'no-real-roots') {
    const count = delta > 0 ? 'duas raízes reais distintas' : delta === 0 ? 'uma raiz real dupla' : 'nenhuma raiz real';
    steps = [
      `O primeiro movimento é calcular Δ = b² − 4ac em ${equation}.`,
      `Δ = (${b})² − 4·(${a})·(${c}) = ${delta}.`,
      `Como Δ ${delta > 0 ? '> 0' : delta === 0 ? '= 0' : '< 0'}, a equação tem ${count}.`,
    ];
    takeaway = 'Δ positivo: duas raízes; Δ zero: raiz dupla; Δ negativo: nenhuma raiz real.';
  } else {
    const [r1, r2] = roots;
    steps = [
      `As raízes informadas são ${r1} e ${r2}; a equação é ${formatEquation(a, b, c)}.`,
      `Pela relação de Viète, r₁·r₂ = c/a. Como aqui a = ${a}, c = a·r₁·r₂.`,
      `c = ${a}·(${r1})·(${r2}) = ${c}.`,
    ];
    takeaway = 'Conhecendo as raízes, o produto ajuda a reconstruir c: c = a·r₁·r₂.';
  }
  return { kind, skill, payoff, steps, takeaway };
}

export function generateQuestionSet(count = 5, difficulty = 'easy') {
  return Array.from({ length: count }, () => generateQuestion(difficulty));
}

export { formatEquation, formatNumber };
