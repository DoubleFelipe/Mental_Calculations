/**
 * Mental Calculations — Math Generator
 * Gerador de equações do 2º grau baseado em matriz de competências pedagógicas e distratores diagnósticos.
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

function assembleQuestion(baseQuestion, distractors) {
  // Distractors é um array de { text, diagnostic }
  // Filtra distratores com texto igual ao correto ou duplicados
  const seenTexts = new Set([baseQuestion.correctAnswer]);
  const validDistractors = [];

  for (const d of distractors) {
    if (!seenTexts.has(d.text) && validDistractors.length < 3) {
      seenTexts.add(d.text);
      validDistractors.push(d);
    }
  }

  // Se faltar algum para fechar 4 alternativas, gera fallback
  let fallbackCount = 1;
  while (validDistractors.length < 3) {
    const fallbackText = `Opção ${fallbackCount++}`;
    if (!seenTexts.has(fallbackText)) {
      seenTexts.add(fallbackText);
      validDistractors.push({
        text: fallbackText,
        diagnostic: 'Esta alternativa não atende às propriedades matemáticas da equação.',
      });
    }
  }

  const allChoices = [
    { text: baseQuestion.correctAnswer, diagnostic: null, isCorrect: true },
    ...validDistractors.slice(0, 3).map(d => ({ text: d.text, diagnostic: d.diagnostic, isCorrect: false })),
  ];

  const shuffledChoices = shuffle(allChoices);
  const alternatives = shuffledChoices.map(c => c.text);
  const diagnostics = shuffledChoices.map(c => c.diagnostic);
  const correctIndex = shuffledChoices.findIndex(c => c.isCorrect);

  return {
    ...baseQuestion,
    alternatives,
    diagnostics,
    correctIndex,
  };
}

/* =============================================================================
   MUNDO 0: MUNDO DAS EQUAÇÕES (Fundamentos & Raízes Simples)
   ============================================================================= */

// 0-0: Raízes Simples (Fatoração direta, a=1, raízes inteiras 1 a 5)
function gen_0_0() {
  const r1 = randInt(1, 4);
  const r2 = randInt(r1, 5);
  const a = 1, b = -(r1 + r2), c = r1 * r2;
  const delta = b * b - 4 * a * c;
  const isDuplicate = r1 === r2;
  const correct = isDuplicate ? `x = ${r1}` : `x₁ = ${r1} e x₂ = ${r2}`;

  const text = isDuplicate
    ? `Resolva mentalmente a equação fatorada:\n(x - ${r1})² = 0`
    : `Encontre as raízes da equação:\n${formatEquation(a, b, c)}`;

  const explanation = isDuplicate
    ? `Como (x - ${r1})² = 0, temos raiz dupla: x = ${r1}.`
    : `Por fatoração: (x - ${r1})(x - ${r2}) = 0.\nPara anular cada fator: x₁ = ${r1} e x₂ = ${r2}.`;

  const distractors = [
    {
      text: isDuplicate ? `x = ${-r1}` : `x₁ = ${-r1} e x₂ = ${-r2}`,
      diagnostic: 'Cuidado com os sinais: para (x - r) = 0, a raiz é positiva (x = +r). Ao isolar x, o sinal inverte!',
    },
    {
      text: isDuplicate ? `x = ${r1 + 1}` : `x₁ = ${r1} e x₂ = ${r2 + 2}`,
      diagnostic: 'A soma e o produto dessas raízes não resultam nos coeficientes b e c da equação original.',
    },
    {
      text: isDuplicate ? `x = 0` : `x₁ = 0 e x₂ = ${r1 + r2}`,
      diagnostic: 'Como o termo c ≠ 0, zero não pode ser uma raiz desta equação.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [r1, r2],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'fácil',
    topic: 'Raízes Simples e Fatoração',
    mentalTip: 'Se a=1, procure dois números que multiplicados dão c e somados dão -b.',
  }, distractors);
}

// 0-1: Discriminante (Cálculo focado em Delta = b² - 4ac)
function gen_0_1() {
  const a = 1;
  const b = randInt(-6, 6);
  const c = randInt(-5, 8);
  const delta = b * b - 4 * a * c;

  const text = `Calcule o discriminante (Δ) de:\n${formatEquation(a, b, c)}`;
  const explanation = `Δ = b² - 4ac\nΔ = (${b})² - 4·(${a})·(${c})\nΔ = ${b*b} - (${4*a*c}) = ${delta}`;

  const distractors = [
    {
      text: `Δ = ${b * b + 4 * a * c}`,
      diagnostic: 'Erro de sinal: você somou 4ac em vez de subtrair (-4ac). Cuidado ao multiplicar os sinais!',
    },
    {
      text: `Δ = ${2 * b - 4 * a * c}`,
      diagnostic: 'Atenção: o termo inicial é b² (b elevado ao quadrado), e não 2·b.',
    },
    {
      text: `Δ = ${delta + (delta > 0 ? -8 : 8)}`,
      diagnostic: 'Erro aritmético no cálculo da potência ou da multiplicação de 4·a·c.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [],
    text,
    correctAnswer: `Δ = ${delta}`,
    explanation,
    difficulty: 'fácil',
    topic: 'Discriminante (Delta)',
    mentalTip: 'Calcule primeiro b². Depois use -4·a·c, prestando muita atenção na regra de sinais.',
  }, distractors);
}

// 0-2: Soma e Produto (Relações de Girard com a=1)
function gen_0_2() {
  const askSum = Math.random() > 0.5;
  const r1 = randInt(-5, 6);
  const r2 = randInt(-5, 6);
  const a = 1, b = -(r1 + r2), c = r1 * r2;
  const delta = b * b - 4 * a * c;

  const text = askSum
    ? `Qual é a SOMA das raízes de:\n${formatEquation(a, b, c)}?`
    : `Qual é o PRODUTO das raízes de:\n${formatEquation(a, b, c)}?`;

  const correctAnswer = askSum ? `S = ${r1 + r2}` : `P = ${c}`;
  const explanation = askSum
    ? `Pelas relações de Vieta, Soma = -b/a = -(${b})/${a} = ${r1 + r2}.`
    : `Pelas relações de Vieta, Produto = c/a = ${c}/${a} = ${c}.`;

  const distractors = askSum ? [
    {
      text: `S = ${b}`,
      diagnostic: 'Erro de sinal: a soma é dada por -b/a (inverte-se o sinal de b), e não apenas +b.',
    },
    {
      text: `S = ${c}`,
      diagnostic: 'Você indicou o Produto das raízes (c/a) em vez da Soma (-b/a).',
    },
    {
      text: `S = ${-(r1 + r2) + 2}`,
      diagnostic: 'Verifique a soma aritmética dos coeficientes.',
    },
  ] : [
    {
      text: `P = ${-c}`,
      diagnostic: 'Erro de sinal: o produto é dado por c/a (mantém-se o sinal de c). Não inverta o sinal do produto!',
    },
    {
      text: `P = ${-b}`,
      diagnostic: 'Você indicou a Soma das raízes (-b/a) em vez do Produto (c/a).',
    },
    {
      text: `P = ${c + 4}`,
      diagnostic: 'Verifique o produto aritmético dos termos.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [r1, r2],
    text,
    correctAnswer,
    explanation,
    difficulty: 'fácil',
    topic: 'Soma e Produto',
    mentalTip: 'Soma = -b/a (troca o sinal de b). Produto = c/a (conserva o sinal de c).',
  }, distractors);
}

// 0-3: Bhaskara I (a=1, delta quadrado perfeito)
function gen_0_3() {
  const r1 = randInt(-4, 5);
  const r2 = randInt(-4, 5);
  const a = 1, b = -(r1 + r2), c = r1 * r2;
  const delta = b * b - 4 * a * c;
  const roots = [r1, r2].sort((x, y) => x - y);
  const correct = roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`;

  const text = `Resolva por Bhaskara:\n${formatEquation(a, b, c)}`;
  const explanation = `Δ = (${b})² - 4·1·(${c}) = ${delta}\nx = (-(${b}) ± √${delta}) / (2·1)\nx = (${-b} ± ${Math.sqrt(delta)}) / 2\n${correct}`;

  const distractors = [
    {
      text: roots[0] === roots[1] ? `x = ${-roots[0]}` : `x₁ = ${-roots[1]} e x₂ = ${-roots[0]}`,
      diagnostic: 'Erro de sinal na fórmula de Bhaskara: o numerador começa com -b, o que inverte o sinal de b.',
    },
    {
      text: roots[0] === roots[1] ? `x = ${roots[0] * 2}` : `x₁ = ${roots[0] * 2} e x₂ = ${roots[1] * 2}`,
      diagnostic: 'Esqueceu de dividir por 2a: você calculou apenas -b ± √Δ e não dividiu pelo denominador 2.',
    },
    {
      text: `x₁ = ${roots[0] + 1} e x₂ = ${roots[1] - 1}`,
      diagnostic: 'Erro no cálculo das operações com a raiz quadrada de Delta.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots,
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'fácil',
    topic: 'Bhaskara I',
    mentalTip: 'Calcule a raiz de Δ e divida por 2 ao final.',
  }, distractors);
}

// 0-4: Desafio Final - Mundo 0 (Mix equilibrado)
function gen_0_4() {
  const pick = randInt(0, 3);
  if (pick === 0) return gen_0_0();
  if (pick === 1) return gen_0_1();
  if (pick === 2) return gen_0_2();
  return gen_0_3();
}

/* =============================================================================
   MUNDO 1: MUNDO DOS COEFICIENTES (Identificação, Vieta, Incompletas & a > 1)
   ============================================================================= */

// 1-0: Identificando Coeficientes (a, b, c desordenados)
function gen_1_0() {
  const a = randInt(2, 4);
  const b = randInt(-7, 7) || 3;
  const c = randInt(-9, 9) || -5;

  const order = randInt(0, 2);
  let eqStr;
  if (order === 0) {
    // b*x + c + a*x² = 0
    eqStr = `${b}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} + ${a}x² = 0`;
  } else if (order === 1) {
    // c + a*x² + b*x = 0
    eqStr = `${c} + ${a}x² ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x = 0`;
  } else {
    // a*x² = -b*x - c
    eqStr = `${a}x² = ${-b}x ${-c >= 0 ? `+ ${-c}` : `- ${Math.abs(-c)}`}`;
  }

  const text = `Identifique os coeficientes (a, b, c) de:\n${eqStr}`;
  const correct = `a = ${a}, b = ${b}, c = ${c}`;
  const explanation = `Colocando na forma canônica ax² + bx + c = 0:\n• 'a' acompanha x² (a = ${a})\n• 'b' acompanha x (b = ${b})\n• 'c' é o termo independente (c = ${c})`;

  const distractors = [
    {
      text: `a = ${b}, b = ${c}, c = ${a}`,
      diagnostic: 'Não confunda a ordem dos termos com os coeficientes: "a" é sempre quem multiplica x², não quem aparece primeiro!',
    },
    {
      text: `a = ${a}, b = ${-b}, c = ${-c}`,
      diagnostic: 'Cuidado ao passar os termos para o mesmo membro: inverta o sinal ao cruzar o sinal de igualdade.',
    },
    {
      text: `a = ${a}, b = ${c}, c = ${b}`,
      diagnostic: 'Você trocou o coeficiente linear "b" pelo termo independente "c".',
    },
  ];

  return assembleQuestion({
    a, b, c, delta: b * b - 4 * a * c, roots: [],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Identificando Coeficientes',
    mentalTip: 'Procure sempre a letra associada: quem acompanha x² é "a", quem acompanha x é "b".',
  }, distractors);
}

// 1-1: Relações de Vieta (Reconstrução da equação)
function gen_1_1() {
  const r1 = randInt(-5, 5);
  const r2 = randInt(-5, 5);
  const S = r1 + r2;
  const P = r1 * r2;
  const a = 1, b = -S, c = P;
  const correct = formatEquation(a, b, c);

  const text = `Qual equação do 2º grau possui raízes\nx₁ = ${r1} e x₂ = ${r2}?`;
  const explanation = `Pela relação de Vieta: x² - Sx + P = 0.\nSoma (S) = ${r1} + (${r2}) = ${S}\nProduto (P) = (${r1}) · (${r2}) = ${P}\nEquação: x² - (${S})x + (${P}) = 0 ➔ ${correct}`;

  const distractors = [
    {
      text: formatEquation(a, S, P),
      diagnostic: 'Erro de sinal: a fórmula de Vieta é x² - Sx + P = 0. A soma entra com sinal invertido!',
    },
    {
      text: formatEquation(a, -S, -P),
      diagnostic: 'O produto (P) conserva o sinal em x² - Sx + P = 0. Não inverta o sinal do termo independente.',
    },
    {
      text: formatEquation(a, -P, S),
      diagnostic: 'Você trocou a posição da Soma com a do Produto na estrutura da equação.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta: b * b - 4 * a * c, roots: [r1, r2],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Relações de Vieta',
    mentalTip: 'A equação canônica com a=1 é sempre: x² - (Soma)x + (Produto) = 0.',
  }, distractors);
}

// 1-2: Equações Incompletas (b=0 ou c=0)
function gen_1_2() {
  const isCZero = Math.random() > 0.5;
  if (isCZero) {
    // ax² + bx = 0 -> x(ax + b) = 0 -> x = 0 ou x = -b/a
    const a = 1;
    const b = randInt(-8, 8) || 4;
    const c = 0;
    const r1 = 0, r2 = -b;
    const roots = [r1, r2].sort((x, y) => x - y);
    const correct = `x₁ = ${roots[0]} e x₂ = ${roots[1]}`;

    const text = `Resolva a equação incompleta (c = 0):\n${formatEquation(a, b, c)}`;
    const explanation = `Colocando x em evidência:\nx(x + ${b}) = 0\nLogo: x = 0 ou x + ${b} = 0 ➔ x = ${-b}.\nRaízes: ${correct}`;

    const distractors = [
      {
        text: `x = ${-b}`,
        diagnostic: 'Atenção: como x foi colocado em evidência, x = 0 é sempre uma das raízes quando c = 0!',
      },
      {
        text: `x₁ = 0 e x₂ = ${b}`,
        diagnostic: 'Erro de sinal: ao resolver x + b = 0, o valor passa para o outro lado negativo (x = -b).',
      },
      {
        text: `x₁ = ${-Math.abs(b)} e x₂ = ${Math.abs(b)}`,
        diagnostic: 'Essa simetria (±) só ocorre quando b = 0. Quando c = 0, uma raiz é obrigatoriamente 0.',
      },
    ];

    return assembleQuestion({
      a, b, c, delta: b * b, roots,
      text,
      correctAnswer: correct,
      explanation,
      difficulty: 'médio',
      topic: 'Equações Incompletas (c = 0)',
      mentalTip: 'Se não tem termo c, coloque x em evidência! Uma raiz é sempre zero.',
    }, distractors);
  } else {
    // ax² - k² = 0 -> x = ±k
    const a = 1;
    const k = randInt(2, 7);
    const b = 0, c = -(k * k);
    const roots = [-k, k];
    const correct = `x₁ = ${-k} e x₂ = ${k}`;

    const text = `Resolva a equação incompleta (b = 0):\n${formatEquation(a, b, c)}`;
    const explanation = `Isolando x²:\nx² = ${k * k}\nx = ±√${k * k}\nx₁ = -${k} e x₂ = ${k}`;

    const distractors = [
      {
        text: `x = ${k}`,
        diagnostic: 'Esqueceu a raiz negativa: potências pares admitem duas raízes simétricas (x = +k e x = -k).',
      },
      {
        text: `x₁ = 0 e x₂ = ${k}`,
        diagnostic: 'Zero não é raiz aqui porque c ≠ 0. Para b = 0, as raízes são simétricas (±).',
      },
      {
        text: `Não possui raízes reais`,
        diagnostic: 'Como c é negativo, x² é igual a um número positivo, logo existem duas raízes reais!',
      },
    ];

    return assembleQuestion({
      a, b, c, delta: -4 * a * c, roots,
      text,
      correctAnswer: correct,
      explanation,
      difficulty: 'médio',
      topic: 'Equações Incompletas (b = 0)',
      mentalTip: 'Se b = 0, isole x² e tire a raiz quadrada direta (lembre-se do ±).',
    }, distractors);
  }
}

// 1-3: Bhaskara II (a > 1 ou raízes fracionárias simples)
function gen_1_3() {
  const a = randInt(2, 3);
  const r1 = randInt(-4, 4);
  const r2 = randInt(-3, 3);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const delta = b * b - 4 * a * c;
  const roots = [r1, r2].sort((x, y) => x - y);
  const correct = roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`;

  const text = `Resolva com a > 1:\n${formatEquation(a, b, c)}`;
  const explanation = `Δ = (${b})² - 4·${a}·(${c}) = ${delta}\nx = (-(${b}) ± √${delta}) / (2·${a})\nx = (${-b} ± ${Math.sqrt(delta)}) / ${2 * a}\n${correct}`;

  const distractors = [
    {
      text: roots[0] === roots[1] ? `x = ${roots[0] * a}` : `x₁ = ${roots[0] * a} e x₂ = ${roots[1] * a}`,
      diagnostic: 'Esqueceu de dividir por 2a: você dividiu apenas por 2 ou não dividiu pelo coeficiente a.',
    },
    {
      text: roots[0] === roots[1] ? `x = ${-roots[0]}` : `x₁ = ${-roots[1]} e x₂ = ${-roots[0]}`,
      diagnostic: 'Erro de sinal: lembre-se de que a fórmula começa com -b no numerador.',
    },
    {
      text: `x₁ = ${roots[0] + 1} e x₂ = ${roots[1] + 1}`,
      diagnostic: 'Atenção às contas aritméticas do numerador e do denominador.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots,
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Bhaskara com a > 1',
    mentalTip: 'Não se esqueça do denominador: ele vale 2·a (o dobro de a)!',
  }, distractors);
}

// 1-4: Desafio Final - Mundo 1 (Mix Mundo 1)
function gen_1_4() {
  const pick = randInt(0, 3);
  if (pick === 0) return gen_1_0();
  if (pick === 1) return gen_1_1();
  if (pick === 2) return gen_1_2();
  return gen_1_3();
}

/* =============================================================================
   MUNDO 2: MUNDO DO DELTA (Interpretação e Classificação do Discriminante)
   ============================================================================= */

// 2-0: Delta Positivo (Δ > 0 -> 2 raízes distintas)
function gen_2_0() {
  const a = 1;
  const r1 = randInt(-5, 2);
  const r2 = randInt(3, 6);
  const b = -(r1 + r2), c = r1 * r2;
  const delta = b * b - 4 * a * c;

  const text = `Na equação ${formatEquation(a, b, c)},\no que podemos afirmar sobre o discriminante (Δ)?`;
  const correct = `Δ = ${delta} (possui 2 raízes reais distintas)`;
  const explanation = `Δ = (${b})² - 4·1·(${c}) = ${delta}.\nComo Δ > 0, a equação possui 2 raízes reais e distintas.`;

  const distractors = [
    {
      text: `Δ = 0 (possui 1 raiz real dupla)`,
      diagnostic: 'Para Δ = 0, o discriminante deve ser nulo. Aqui Δ = ' + delta + ' > 0.',
    },
    {
      text: `Δ < 0 (não possui raízes reais)`,
      diagnostic: 'Erro no cálculo do sinal de Δ: aqui o discriminante é positivo (+ ' + delta + ').',
    },
    {
      text: `Δ = ${delta} (possui infinitas raízes)`,
      diagnostic: 'Uma equação do 2º grau nunca tem infinitas raízes reais (no máximo 2).',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [r1, r2],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Delta Positivo',
    mentalTip: 'Δ > 0 garante sempre duas raízes reais e diferentes.',
  }, distractors);
}

// 2-1: Delta Zero (Δ = 0 -> 1 raiz real dupla)
function gen_2_1() {
  const a = 1;
  const r = randInt(-6, 6) || 3;
  const b = -2 * r;
  const c = r * r;
  const delta = 0;

  const text = `Quantas raízes reais possui o trinômio:\n${formatEquation(a, b, c)}?`;
  const correct = '1 raiz real dupla (x = ' + r + ')';
  const explanation = `Δ = (${b})² - 4·1·(${c}) = ${b*b} - ${4*c} = 0.\nComo Δ = 0, a raiz de Δ é zero: x = -b/(2a) = ${r} (raiz dupla).`;

  const distractors = [
    {
      text: '2 raízes reais distintas',
      diagnostic: 'Duas raízes distintas só ocorrem se Δ > 0. Aqui o discriminante é exatamente zero.',
    },
    {
      text: 'Nenhuma raiz real',
      diagnostic: 'Não possuir raízes reais só ocorre se Δ < 0. Como Δ = 0, há uma raiz real dupla.',
    },
    {
      text: '1 raiz real dupla (x = ' + (-r) + ')',
      diagnostic: 'Erro de sinal: a fórmula x = -b/(2a) inverte o sinal do coeficiente b.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [r],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Delta Zero (Raiz Dupla)',
    mentalTip: 'Trinômios da forma (x - k)² sempre têm Δ = 0 e raiz única k.',
  }, distractors);
}

// 2-2: Delta Negativo (Δ < 0 -> Sem raízes reais)
function gen_2_2() {
  const a = randInt(1, 2);
  const b = randInt(-4, 4);
  const c = randInt(5, 12);
  const delta = b * b - 4 * a * c; // sempre negativo

  const text = `A equação ${formatEquation(a, b, c)}\npossui raízes reais?`;
  const correct = 'Não possui raízes reais (Δ < 0)';
  const explanation = `Δ = (${b})² - 4·(${a})·(${c}) = ${b*b} - ${4*a*c} = ${delta}.\nComo Δ < 0 e não há raiz real de número negativo, a equação não possui raízes reais.`;

  const distractors = [
    {
      text: 'Possui 2 raízes reais distintas',
      diagnostic: 'Cuidado: para haver 2 raízes reais, Δ precisa ser maior que zero. Aqui Δ = ' + delta + '.',
    },
    {
      text: 'Possui 1 raiz real dupla',
      diagnostic: 'Raiz real dupla só ocorre se Δ = 0. Aqui Δ = ' + delta + ' < 0.',
    },
    {
      text: 'Possui raízes x₁ = 0 e x₂ = ' + Math.abs(b),
      diagnostic: 'Zero só seria raiz se c fosse igual a zero, o que não é o caso.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots: [],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'médio',
    topic: 'Delta Negativo',
    mentalTip: 'Se b² for menor que 4ac, Δ será negativo e não há raízes reais.',
  }, distractors);
}

// 2-3: Classificação do Discriminante (Análise rápida)
function gen_2_3() {
  const type = randInt(0, 2);
  if (type === 0) return gen_2_0();
  if (type === 1) return gen_2_1();
  return gen_2_2();
}

// 2-4: Desafio Final - Mundo 2
function gen_2_4() {
  const pick = randInt(0, 2);
  if (pick === 0) return gen_2_1();
  if (pick === 1) return gen_2_2();
  return gen_2_0();
}

/* =============================================================================
   MUNDO 3: MUNDO DOS MESTRES (Problemas Aplicados, Fator Comum & Maestria)
   ============================================================================= */

// 3-0: Problemas Aplicados (Geometria e Números)
function gen_3_0() {
  const x = randInt(3, 8);
  const area = x * (x + 2);

  const text = `A área de um retângulo é ${area} m².\nSe o comprimento mede (x + 2) e a largura mede x,\nqual é a largura (x)?`;
  const correct = `x = ${x}`;
  const explanation = `Área = x(x + 2) = ${area}\nx² + 2x - ${area} = 0\n(x - ${x})(x + ${x + 2}) = 0\nComo medidas geométricas devem ser positivas, x = ${x}.`;

  const distractors = [
    {
      text: `x = ${x + 2}`,
      diagnostic: 'Esse é o comprimento (x + 2), o enunciado perguntou a largura (x).',
    },
    {
      text: `x = ${-(x + 2)}`,
      diagnostic: 'Medidas de comprimento e área não podem ser negativas em geometria real!',
    },
    {
      text: `x = ${x - 1}`,
      diagnostic: 'Essa largura não resulta na área indicada: ' + (x - 1) + ' · ' + (x + 1) + ' ≠ ' + area + '.',
    },
  ];

  return assembleQuestion({
    a: 1, b: 2, c: -area, delta: 4 + 4 * area, roots: [x, -(x + 2)],
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'difícil',
    topic: 'Problemas Aplicados',
    mentalTip: 'Pense em dois números cuja diferença é 2 e o produto é a área dada.',
  }, distractors);
}

// 3-1: Coeficientes Grandes (Simplificação por fator comum)
function gen_3_1() {
  const factor = randInt(2, 4);
  const r1 = randInt(1, 4);
  const r2 = randInt(r1, 5);
  const a = factor, b = -factor * (r1 + r2), c = factor * r1 * r2;
  const delta = b * b - 4 * a * c;
  const roots = [r1, r2].sort((x, y) => x - y);
  const correct = roots[0] === roots[1] ? `x = ${roots[0]}` : `x₁ = ${roots[0]} e x₂ = ${roots[1]}`;

  const text = `Simplifique mentalmente e resolva:\n${formatEquation(a, b, c)}`;
  const explanation = `Dica mental: divida toda a equação pelo fator comum (${factor}):\nx² - ${r1 + r2}x + ${r1 * r2} = 0\n(x - ${r1})(x - ${r2}) = 0 ➔ ${correct}`;

  const distractors = [
    {
      text: roots[0] === roots[1] ? `x = ${roots[0] * factor}` : `x₁ = ${roots[0] * factor} e x₂ = ${roots[1] * factor}`,
      diagnostic: 'Você multiplicou as raízes pelo fator. Ao dividir a equação pelo fator comum, as raízes permanecem as mesmas!',
    },
    {
      text: roots[0] === roots[1] ? `x = ${-roots[0]}` : `x₁ = ${-roots[1]} e x₂ = ${-roots[0]}`,
      diagnostic: 'Erro de sinal: lembre-se de que (x - r) = 0 resulta na raiz positiva r.',
    },
    {
      text: `x₁ = ${roots[0] + 1} e x₂ = ${roots[1] + 1}`,
      diagnostic: 'Verifique a divisão dos termos pelo fator comum.',
    },
  ];

  return assembleQuestion({
    a, b, c, delta, roots,
    text,
    correctAnswer: correct,
    explanation,
    difficulty: 'difícil',
    topic: 'Simplificação por Fator Comum',
    mentalTip: 'Todos os termos são múltiplos de ' + factor + '? Divida a equação inteira antes de calcular!',
  }, distractors);
}

// 3-2: Propriedades Avançadas (Raízes Simétricas e Inversas)
function gen_3_2() {
  const isSymmetric = Math.random() > 0.5;
  if (isSymmetric) {
    const k = randInt(3, 8);
    const text = `Para quais condições a equação\nax² + bx + c = 0 possui raízes SIMÉTRICAS (x₁ = -x₂)?`;
    const correct = 'Quando b = 0 e a·c < 0';
    const explanation = 'Raízes simétricas somam zero: x₁ + x₂ = -b/a = 0 ➔ b = 0. E para serem reais, x² = -c/a > 0 ➔ a·c < 0.';

    const distractors = [
      {
        text: 'Quando c = 0',
        diagnostic: 'Se c = 0, uma raiz é zero, logo as raízes não são simétricas (a menos que ambas fossem zero).',
      },
      {
        text: 'Quando a = c',
        diagnostic: 'A condição a = c faz com que o produto seja 1 (raízes inversas, não simétricas).',
      },
      {
        text: 'Quando Δ = 0',
        diagnostic: 'Quando Δ = 0, as raízes são iguais (x₁ = x₂), e não simétricas (x₁ = -x₂).',
      },
    ];

    return assembleQuestion({
      a: 1, b: 0, c: -k * k, delta: 4 * k * k, roots: [-k, k],
      text,
      correctAnswer: correct,
      explanation,
      difficulty: 'difícil',
      topic: 'Raízes Simétricas',
      mentalTip: 'Raízes simétricas têm soma nula: logo -b/a = 0, o que exige b = 0.',
    }, distractors);
  } else {
    const text = `Para qual condição a equação\nax² + bx + c = 0 possui raízes INVERSAS (x₁ · x₂ = 1)?`;
    const correct = 'Quando a = c (e a ≠ 0)';
    const explanation = 'O produto das raízes é P = c/a. Para o produto ser 1 (inversas), devemos ter c/a = 1 ➔ a = c.';

    const distractors = [
      {
        text: 'Quando b = 0',
        diagnostic: 'Quando b = 0, as raízes são simétricas (opostas), não inversas.',
      },
      {
        text: 'Quando c = 0',
        diagnostic: 'Se c = 0, o produto das raízes seria zero, impossibilitando que sejam inversas.',
      },
      {
        text: 'Quando a = -c',
        diagnostic: 'Se a = -c, o produto seria -1, não +1.',
      },
    ];

    return assembleQuestion({
      a: 2, b: -5, c: 2, delta: 9, roots: [0.5, 2],
      text,
      correctAnswer: correct,
      explanation,
      difficulty: 'difícil',
      topic: 'Raízes Inversas',
      mentalTip: 'Produto = c/a. Para x₁ · x₂ = 1, o numerador deve ser igual ao denominador: a = c.',
    }, distractors);
  }
}

// 3-3: Miscelânea
function gen_3_3() {
  const pick = randInt(0, 3);
  if (pick === 0) return gen_3_0();
  if (pick === 1) return gen_3_1();
  if (pick === 2) return gen_3_2();
  return gen_1_3();
}

// 3-4: Desafio Supremo
function gen_3_4() {
  const pick = randInt(0, 4);
  if (pick === 0) return gen_3_0();
  if (pick === 1) return gen_3_1();
  if (pick === 2) return gen_3_2();
  if (pick === 3) return gen_1_3();
  return gen_2_1();
}

/* =============================================================================
   MATRIZ DE COMPETÊNCIAS PEDAGÓGICAS (Mapeamento 20 fases)
   ============================================================================= */

export const PEDAGOGICAL_MATRIX = {
  // Mundo 0: Mundo das Equações
  '0-0': gen_0_0, // Raízes Simples
  '0-1': gen_0_1, // Discriminante
  '0-2': gen_0_2, // Soma e Produto
  '0-3': gen_0_3, // Bhaskara I
  '0-4': gen_0_4, // Desafio Final

  // Mundo 1: Mundo dos Coeficientes
  '1-0': gen_1_0, // Identificando Coeficientes
  '1-1': gen_1_1, // Relações de Vieta
  '1-2': gen_1_2, // Equações Incompletas
  '1-3': gen_1_3, // Bhaskara II
  '1-4': gen_1_4, // Desafio Final

  // Mundo 2: Mundo do Delta
  '2-0': gen_2_0, // Delta Positivo
  '2-1': gen_2_1, // Delta Zero
  '2-2': gen_2_2, // Delta Negativo
  '2-3': gen_2_3, // Classificação
  '2-4': gen_2_4, // Desafio Final

  // Mundo 3: Mundo dos Mestres
  '3-0': gen_3_0, // Problemas Aplicados
  '3-1': gen_3_1, // Coeficientes Grandes
  '3-2': gen_3_2, // Raízes Inversas e Simétricas
  '3-3': gen_3_3, // Miscelânea
  '3-4': gen_3_4, // Desafio Supremo
};

export function generateQuestionForLevel(worldIndex = 0, levelIndex = 0) {
  const key = `${worldIndex}-${levelIndex}`;
  const generator = PEDAGOGICAL_MATRIX[key];
  if (typeof generator === 'function') {
    return generator();
  }
  return gen_0_0();
}

export function generateQuestion(difficulty = 'easy', worldIndex = null, levelIndex = null) {
  if (worldIndex !== null && levelIndex !== null) {
    return generateQuestionForLevel(worldIndex, levelIndex);
  }
  if (difficulty === 'easy') return gen_0_0();
  if (difficulty === 'medium') return gen_1_0();
  return gen_3_1();
}

export function generateQuestionSet(count = 5, difficulty = 'easy', worldIndex = null, levelIndex = null) {
  if (worldIndex !== null && levelIndex !== null) {
    return Array.from({ length: count }, () => generateQuestionForLevel(worldIndex, levelIndex));
  }
  return Array.from({ length: count }, () => generateQuestion(difficulty));
}

export { formatEquation, formatNumber };
