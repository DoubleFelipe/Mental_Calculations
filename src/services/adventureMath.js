/** Questions shared by environmental mechanisms and the adventure practice mode. */
const integer = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function question(text, answer, distractors, explanation, topic) {
  const alternatives = [...new Set([answer, ...distractors].map(String))];
  for (let n = 1; alternatives.length < 4; n++) if (!alternatives.includes(String(n))) alternatives.push(String(n));
  // Fisher–Yates keeps the answer position independent of the answer value.
  const options = alternatives.slice(0, 4);
  for (let i = options.length - 1; i > 0; i--) { const j = integer(0, i); [options[i], options[j]] = [options[j], options[i]]; }
  return { text, correctAnswer: String(answer), alternatives: options, correctIndex: options.indexOf(String(answer)), explanation, mentalTip: explanation, topic, difficulty: 'Aventura', diagnostics: options.map(() => explanation) };
}
export function generateAdventureQuestion(world, level = 0, round = 0) {
  if (world === 4 && level === 4) {
    if (round < 5) return generateAdventureQuestion(round, Math.min(3, round + 1), round);
    const a = integer(3, 8), b = integer(2, 5);
    const result = (a + b) * 2;
    return question(`O Coração precisa do perímetro de um retângulo com lados x e ${b}. Se x + 2 = ${a + 2}, qual é o perímetro?`, result, [a * b, a + b, result + 4], `Primeiro, x = ${a + 2} − 2 = ${a}. Depois, P = 2 × (${a} + ${b}) = ${result}.`, 'Desafio combinado');
  }
  const a = integer(3, 10 + level * 4), b = integer(2, 9);
  if (world === 0) {
    const subtract = (round + level) % 2 === 1;
    const left = subtract ? a + b : a;
    const answer = subtract ? a : a + b;
    return question(`${left} ${subtract ? '−' : '+'} ${b} = ?`, answer, [answer + 1, answer - 1, answer + b], subtract ? `Retire ${b} de ${left}: restam ${answer}. Confira: ${answer} + ${b} = ${left}.` : `Some ${a} e ${b}. Você pode completar uma dezena primeiro. O total é ${answer}.`, subtract ? 'Subtração' : 'Adição');
  }
  if (world === 1) {
    const x = integer(2, level > 1 ? 12 : 6), y = integer(2, 9), z = level >= 3 ? integer(2, 3) : 1;
    return question(`${x} × ${y}${z > 1 ? ` × ${z}` : ''} = ?`, x*y*z, [x+y+z, x*y*z+x, x*y*z-y], `${x} grupos de ${y} formam ${x*y}.${z > 1 ? ` Multiplique por ${z}: ${x*y*z}.` : ''}`, z > 1 ? 'Múltiplos fatores' : 'Multiplicação');
  }
  if (world === 2) {
    const denominator = integer(3, 10), numerator = integer(1, denominator - 1), factor = integer(2, 4);
    const divisor = gcd(numerator, denominator), simple = `${numerator/divisor}/${denominator/divisor}`;
    if (level === 2 || round % 3 === 2) {
      return question(`Qual é maior: ${numerator}/${denominator} ou ${numerator + 1}/${denominator}?`, `${numerator+1}/${denominator}`, [`${numerator}/${denominator}`, 'São iguais', 'Não é possível comparar'], 'Com denominadores iguais, a fração com maior numerador é maior.', 'Comparação de frações');
    }
    return question(`${level === 3 ? 'Qual fração é equivalente a' : 'Simplifique'} ${numerator*factor}/${denominator*factor}${level === 3 ? '?' : ' até a forma irredutível.'}`, simple, [`${numerator*factor}/${denominator}`, `${numerator}/${denominator*factor}`, `${denominator/divisor}/${numerator/divisor}`], `Divida numerador e denominador pelo mesmo número, ${factor*divisor}: ${simple}. O valor da fração permanece igual.`, level === 3 ? 'Equivalência de frações' : 'Simplificação de frações');
  }
  if (world === 3) {
    const x = integer(2, 12), coefficient = level >= 2 ? integer(2, 5) : 1;
    const result = coefficient*x + b;
    return question(`${coefficient > 1 ? coefficient : ''}x + ${b} = ${result}. Quanto vale x?`, x, [x + b, x+1, result-b+1], `Subtraia ${b} dos dois lados${coefficient > 1 ? ` e divida por ${coefficient}` : ''}: x = ${x}. Confira substituindo na equação.`, 'Equações do primeiro grau');
  }
  if (level === 0 || round % 4 === 3) {
    const sides = integer(3, 6), names = {3:'Triângulo',4:'Quadrilátero',5:'Pentágono',6:'Hexágono'};
    return question(`Qual figura tem ${sides} lados?`, names[sides], Object.values(names).filter(n => n !== names[sides]), `${names[sides]} é uma figura com ${sides} lados.`, 'Formas geométricas');
  }
  const perimeter = level === 1;
  return question(`Um retângulo mede ${a} m por ${b} m. Qual é ${perimeter ? 'seu perímetro, em metros' : 'sua área, em metros quadrados'}?`, perimeter ? 2*(a+b) : a*b, [a+b, perimeter ? a*b+1 : 2*(a+b)+1, a*b+b], perimeter ? `Some todos os lados: ${a} + ${b} + ${a} + ${b} = ${2*(a+b)} m.` : `Área = base × altura = ${a} × ${b} = ${a*b} m².`, perimeter ? 'Perímetro' : 'Área');
}
export const generateAdventureSet = (count, world, level) => Array.from({length: count}, (_, i) => generateAdventureQuestion(world, level, i));
