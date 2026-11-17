import { LEVEL_TUTORIALS, TOPIC_TUTORIAL, TUTORIALS, TUTORIAL_VERSION } from '../data/tutorials.js';

export function getLevelTutorialIds(worldIndex, levelIndex) {
  return LEVEL_TUTORIALS[`${worldIndex}-${levelIndex}`] || LEVEL_TUTORIALS['0-0'];
}

export function getPendingTutorialIds(gameState, playerKey, worldIndex, levelIndex) {
  const completed = gameState.tutorials?.completedByPlayer?.[playerKey] || {};
  return getLevelTutorialIds(worldIndex, levelIndex).filter((id) => completed[id] !== TUTORIAL_VERSION);
}

export function completeTutorials(gameState, playerKey, ids) {
  const tutorials = gameState.tutorials || {};
  const completedByPlayer = tutorials.completedByPlayer || {};
  const completed = { ...completedByPlayer[playerKey] };
  for (const id of ids) if (TUTORIALS[id]) completed[id] = TUTORIAL_VERSION;
  return { ...gameState, tutorials: { ...tutorials, completedByPlayer: { ...completedByPlayer, [playerKey]: completed } } };
}

export function getQuestionTutorialId(question) {
  return TOPIC_TUTORIAL[question.topic] || 'introduction';
}

/** Dicas de processo, sem entregar as raízes nem eliminar alternativas. */
export function getProgressiveHints(question) {
  const id = getQuestionTutorialId(question);
  const coefficients = 'Organize a equação com zero à direita. a acompanha x², b acompanha x e c fica sozinho. Inclua os sinais; um termo ausente tem coeficiente zero.';
  const delta = `Substitua com parênteses: Δ = (${question.b})² − 4 · (${question.a}) · (${question.c}). Faça a potência e a multiplicação antes da subtração.`;
  const hints = {
    introduction: [coefficients, 'Observe o maior expoente de x. Ele é 2?', 'Uma raiz precisa tornar a igualdade verdadeira. Você pode conferir por substituição.'],
    coefficients: ['Não se guie pela posição dos termos. Primeiro organize a igualdade na forma ax² + bx + c = 0.', coefficients, 'Ao mover um termo, faça a operação inversa nos dois lados. Confira especialmente os sinais de b e c.'],
    factoring: [coefficients, 'Com a = 1, procure dois números com soma −b e produto c. Escreva (x − r)(x − s) = 0.', 'Iguale cada fator a zero. Se aparecer um fator ao quadrado, o mesmo valor é uma raiz dupla. Confira os valores na equação.'],
    delta: [coefficients, delta, 'Confira os sinais: o quadrado de um negativo é positivo; subtrair um número negativo é somar.'],
    bhaskara: [coefficients, delta, 'Com Δ ≥ 0, use x = (−b ± √Δ)/(2a). Faça uma conta com + e outra com − e divida cada numerador inteiro por 2a.'],
    bhaskaraAdvanced: [coefficients, delta, `O denominador é 2 · a = 2 · (${question.a}). Ele divide TODO o numerador (−b ± √Δ). Não divida só por 2.`],
    incomplete: [coefficients, question.c === 0 ? 'Como c = 0, coloque x em evidência: x(ax + b) = 0. Não divida por x.' : 'Como b = 0, isole x² dividindo por a. Observe se o valor obtido é positivo, zero ou negativo.', question.c === 0 ? 'Um produto é zero quando pelo menos um fator é zero. Resolva cada fator separadamente.' : 'Se x² = k > 0, use x = ±√k. Se k = 0, a raiz é zero; se k < 0, não há raiz real.'],
    sumProduct: [coefficients, 'Leia se a pergunta pede SOMA ou PRODUTO. São operações diferentes.', 'Para soma use S = −b/a; para produto use P = c/a. Só a soma troca o sinal de b.'],
    vieta: ['Comece pelas duas raízes dadas no enunciado.', 'Calcule S somando as raízes e P multiplicando-as. Observe os sinais dos números negativos.', 'Com a = 1, reconstrua x² − Sx + P = 0. A soma entra com sinal oposto; o produto mantém seu sinal.'],
    deltaPositive: [coefficients, delta, 'Compare Δ com zero: positivo → duas raízes distintas; zero → uma dupla; negativo → nenhuma real.'],
    deltaZero: [coefficients, delta, 'Se Δ = 0, √Δ = 0 e os dois sinais dão o mesmo valor. Calcule x = −b/(2a), com atenção ao sinal de −b.'],
    deltaNegative: [coefficients, delta, 'Compare b² com 4ac. Se Δ < 0, não existe √Δ nos números reais: pare antes de tentar Bhaskara.'],
    applied: ['Separe a medida pedida da outra medida. Área de retângulo é largura vezes comprimento.', 'Monte x(x + 2) = área. Distribua x e leve a área para o lado esquerdo. Você pode fatorar ou usar Bhaskara.', 'Das soluções da equação, só uma medida positiva faz sentido. Confira se largura · comprimento dá a área e responda à medida pedida.'],
    simplification: ['Procure um número diferente de zero que divida todos os coeficientes.', 'Divida TODOS os termos, incluindo o termo independente, pelo mesmo fator. O zero do outro lado também é dividido.', 'Resolva a equação simplificada por fatoração ou Bhaskara. As raízes permanecem iguais: não multiplique as soluções pelo fator.'],
    rootProperties: ['Veja se o enunciado pede raízes simétricas (opostas) ou inversas (produto 1).', 'Use S = −b/a e P = c/a. Para opostas não nulas, S = 0; para inversas, P = 1.', 'Simétricas reais não nulas exigem b = 0 e a·c < 0. Inversas exigem a = c ≠ 0; para serem reais, também Δ ≥ 0.'],
  };
  return hints[id];
}
