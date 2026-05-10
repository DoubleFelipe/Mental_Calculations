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
      text: `Encontre as raízes da equação:\n${formatEquation(a, b, c)}`,
      correctAnswer: roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`,
      explanation: `Δ = ${b}² - 4·${a}·${c} = ${delta}\nx = (${-b} ± √${delta}) / ${2*a}\nx₁ = ${roots[0]}, x₂ = ${roots[1]}`,
    },
    {
      text: `Qual o discriminante (Δ) de:\n${formatEquation(a, b, c)}?`,
      correctAnswer: `Δ = ${delta}`,
      explanation: `Δ = b² - 4ac = (${b})² - 4·(${a})·(${c}) = ${delta}`,
    },
    {
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
      text: `Resolva:\n${formatEquation(a, b, c)}`,
      correctAnswer: roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`,
      explanation: `Δ = ${delta}, x = (${-b} ± √${delta}) / ${2*a}`,
    },
    {
      text: `Produto das raízes de:\n${formatEquation(a, b, c)}?`,
      correctAnswer: `P = ${formatNumber(c/a)}`,
      explanation: `P = c/a = ${c}/${a} = ${formatNumber(c/a)}`,
    },
    {
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
    return { a, b, c, delta, roots: [], text: `A equação ${formatEquation(a, b, c)} possui raízes reais?`, correctAnswer: 'Não possui raízes reais', explanation: `Δ = ${delta}. Como Δ < 0, não há raízes reais.`, difficulty: 'difícil' };
  } else if (type === 1) {
    const r1 = randInt(-7, 7), r2 = randInt(-7, 7), a = 1;
    const b = -a*(r1+r2), c = a*r1*r2;
    return { a, b, c, delta: b*b-4*a*c, roots: [r1,r2], text: `Se as raízes são ${r1} e ${r2}, qual o valor de c?`, correctAnswer: `c = ${c}`, explanation: `P = c/a → c = ${r1} × ${r2} = ${c}`, difficulty: 'difícil' };
  } else {
    const a = randInt(2, 4), r1 = randInt(-8, 8), r2 = randInt(-8, 8);
    const b = -a*(r1+r2), c = a*r1*r2, delta = b*b-4*a*c;
    const roots = [r1,r2].sort((x,y)=>x-y);
    return { a, b, c, delta, roots, text: `Resolva:\n${formatEquation(a, b, c)}`, correctAnswer: roots[0]===roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`, explanation: `Δ = ${delta}, x = (${-b} ± √${delta}) / ${2*a}`, difficulty: 'difícil' };
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
  return { ...q, alternatives: alts, correctIndex: alts.indexOf(q.correctAnswer) };
}

export function generateQuestionSet(count = 5, difficulty = 'easy') {
  return Array.from({ length: count }, () => generateQuestion(difficulty));
}

export function getTimeLimit(difficulty) {
  return difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25;
}

export { formatEquation, formatNumber };
