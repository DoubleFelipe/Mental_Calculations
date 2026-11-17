/** Lições independentes do gerador: os exemplos nunca entregam a questão da partida. */
const page = (title, text, formula, note, visual) => ({ title, text, formula, note, visual });
const practice = (title, formula, prompt, options, correct, feedback) => ({
  title, formula, prompt, options, correct, feedback,
});

export const TUTORIAL_VERSION = 1;
export const TUTORIALS = {
  introduction: {
    title: 'Conheça as equações do 2º grau',
    pages: [
      page('O que estamos procurando?', 'Léo, uma equação é uma igualdade com um valor desconhecido. Resolver é descobrir quais valores de x tornam a igualdade verdadeira.', 'x² − 5x + 6 = 0', 'O maior expoente de x é 2: por isso ela é do segundo grau. x² significa x · x.'),
      page('Três peças da mesma equação', 'Na forma ax² + bx + c = 0, a acompanha x², b acompanha x e c aparece sozinho. O coeficiente a precisa ser diferente de zero.', 'ax² + bx + c = 0', 'Se a = 0, o termo de segundo grau desaparece.', 'coefficients'),
      page('Completa ou incompleta?', 'Completa: a, b e c são diferentes de zero. Incompleta: b ou c (ou os dois) valem zero. Ela continua sendo do 2º grau se a ≠ 0.', 'x² − 5x + 6 = 0  →  completa\nx² − 9 = 0  →  b = 0\nx² + 3x = 0  →  c = 0\n2x² = 0  →  b = c = 0', 'Um termo ausente tem coeficiente zero.'),
    ],
    practice: [practice('Reconheça o segundo grau', '3x² − 12 = 0', 'Como classificamos esta equação?', ['Incompleta, com b = 0', 'Completa', 'Não é do segundo grau'], 0, [
      'Isso! a = 3, b = 0 e c = −12. O termo x² existe e o termo com x não aparece.',
      'Observe que não há termo com x. Seu coeficiente b é zero, então a equação é incompleta.',
      'O maior expoente é 2 e a = 3 ≠ 0. Ela é do segundo grau, mesmo sem o termo com x.',
    ])],
  },
  coefficients: {
    title: 'Identifique a, b e c',
    pages: [
      page('O sinal faz parte do coeficiente', 'Compare cada termo com ax² + bx + c = 0. Leia também o sinal que vem antes do número.', '2x² + 5x − 3 = 0\na = 2   ·   b = 5   ·   c = −3', 'Em x², a = 1. Em −x², a = −1. O número 1 pode ficar escondido!', 'coefficients'),
      page('Organize antes de identificar', 'A posição na linha não define o coeficiente. Primeiro deixe todos os termos do mesmo lado, com zero no outro, e organize por potência.', '2x² = −5x + 3\n2x² + 5x − 3 = 0', 'Somamos 5x e subtraímos 3 nos dois lados. Assim, a igualdade é preservada.'),
    ],
    practice: [practice('Agora é com você', '3x² − 4x + 1 = 0', 'Quais são os coeficientes?', ['a = 3, b = 4, c = 1', 'a = 3, b = −4, c = 1', 'a = −4, b = 3, c = 1'], 1, [
      'O sinal de menos acompanha 4x: o coeficiente b é −4, não +4.',
      'Exato! 3 acompanha x², −4 acompanha x e 1 está sozinho.',
      'Procure a potência: a acompanha x² e b acompanha x. A ordem é a = 3 e b = −4.',
    ])],
  },
  factoring: {
    title: 'Raízes simples e fatoração',
    pages: [
      page('O que é uma raiz?', 'Raiz é um valor de x que faz a igualdade funcionar. Vamos conferir x = 2 na equação abaixo.', 'x² − 5x + 6 = 0\n2² − 5 · 2 + 6 = 4 − 10 + 6 = 0', 'Como o resultado é zero, 2 é uma raiz.'),
      page('Transforme uma soma em produto', 'Quando a = 1, procure dois números com soma 5 (o oposto de b) e produto 6 (o valor de c). São 2 e 3.', 'x² − 5x + 6 = (x − 2)(x − 3)\n(x − 2)(x − 3) = 0', 'Confira: x² − 3x − 2x + 6 = x² − 5x + 6.'),
      page('Um dos fatores precisa ser zero', 'Se um produto é zero, pelo menos um fator é zero. Resolva cada igualdade separadamente.', 'x − 2 = 0  →  x = 2\nx − 3 = 0  →  x = 3', 'Em (x − 4)² = 0, os dois fatores são iguais: só há o valor x = 4, chamado raiz dupla.'),
    ],
    practice: [
      practice('Leia as peças', 'x² − 7x + 12 = 0', 'Quais são a, b e c?', ['1, −7 e 12', '1, 7 e 12', '0, −7 e 12'], 0, ['Isso! O 1 de x² está implícito e b inclui o sinal de menos.', 'Inclua o sinal do termo: b = −7.', 'O termo x² está presente: seu coeficiente é 1.']),
      practice('Escolha um caminho', 'x² − 7x + 12 = 0', 'Qual fatoração reconstrói esta equação?', ['(x + 3)(x + 4) = 0', '(x − 3)(x − 4) = 0', 'x(x − 7) = 0'], 1, ['Expandir daria +7x. Precisamos de −7x.', 'Sim! −3x − 4x = −7x e (−3)(−4) = 12.', 'Essa expressão tem termo independente zero. Falta o +12.']),
      practice('Encontre as raízes', '(x − 3)(x − 4) = 0', 'Quais valores anulam os fatores?', ['−3 e −4', '0 e 7', '3 e 4'], 2, ['Em x − 3 = 0, somamos 3 nos dois lados: x = 3. Faça o mesmo no outro fator.', 'Zero não anula nenhum fator. Resolva cada fator igual a zero.', 'Muito bem! x = 3 ou x = 4. Substitua na equação para conferir.']),
    ],
  },
  delta: {
    title: 'Calcule o discriminante Δ',
    pages: [
      page('Delta é uma pista sobre as raízes', 'O discriminante usa os coeficientes da equação organizada. A letra grega Δ se lê “delta”.', 'Δ = b² − 4ac\nx² − 5x + 6 = 0\na = 1, b = −5, c = 6', 'b² é b vezes b. Não é 2 vezes b.'),
      page('Substitua com cuidado', 'Use parênteses para manter o sinal dos coeficientes. Calcule a potência e a multiplicação antes da subtração.', 'Δ = (−5)² − 4 · 1 · 6\nΔ = 25 − 24\nΔ = 1', '(−5)² = 25 porque (−5) · (−5) = 25.'),
      page('O sinal conta uma história', 'Se Δ > 0, temos duas raízes reais distintas. Se Δ = 0, temos uma raiz real dupla. Se Δ < 0, não temos raízes reais.', 'Δ > 0  →  duas diferentes\nΔ = 0  →  uma dupla\nΔ < 0  →  nenhuma real', 'Nos números reais, o quadrado de um número nunca é negativo.', 'delta'),
    ],
    practice: [practice('Experimente calcular', 'x² + 2x − 3 = 0', 'a = 1, b = 2, c = −3. Quanto vale Δ?', ['−8', '16', '8'], 1, [
      'Verifique os sinais: −4 · 1 · (−3) é +12. Então calculamos 4 + 12.',
      'Correto! Δ = 2² − 4 · 1 · (−3) = 4 + 12 = 16.',
      'Calcule 2² = 4 e 4 · 1 · (−3) = −12. Subtrair −12 é somar 12.',
    ])],
  },
  bhaskara: {
    title: 'Resolva com Bhaskara',
    pages: [
      page('Um caminho para qualquer equação do 2º grau', 'Depois de identificar a, b e c e calcular Δ, use Bhaskara. Se Δ for negativo, paramos: não há raízes reais.', 'x = (−b ± √Δ) / (2a)', '−b é o oposto de b. √Δ é a raiz quadrada de delta. ± pede duas contas: uma com + e outra com −. Divida todo o numerador por 2 · a.'),
      page('1 · Organize e calcule Δ', 'Vamos resolver um exemplo completo. Aqui a = 1, b = −5 e c = 6.', 'x² − 5x + 6 = 0\nΔ = (−5)² − 4 · 1 · 6\nΔ = 25 − 24 = 1', 'Δ é positivo: esperamos duas raízes diferentes.'),
      page('2 · Substitua na fórmula', 'O oposto de −5 é +5. A raiz quadrada de 1 é 1. O denominador é 2 · 1 = 2.', 'x = (−(−5) ± √1) / (2 · 1)\nx = (5 ± 1) / 2', 'O traço da divisão abrange tudo: (5 ± 1), não apenas o 1.'),
      page('3 · Faça as duas contas', 'Use uma vez o sinal + e outra vez o sinal −. A ordem das raízes não muda a solução.', 'x₁ = (5 + 1) / 2 = 6 / 2 = 3\nx₂ = (5 − 1) / 2 = 4 / 2 = 2', 'Conferência: 3² − 5 · 3 + 6 = 0 e 2² − 5 · 2 + 6 = 0.'),
    ],
    practice: [
      practice('Prepare os valores', 'x² − 3x + 2 = 0', 'Qual identificação está correta?', ['a = 1, b = −3, c = 2', 'a = 1, b = 3, c = 2', 'a = 1, b = −3, c = −2'], 0, ['Isso! Agora podemos substituir esses valores nas fórmulas.', 'O sinal de menos pertence ao b: b = −3.', 'O termo independente é +2. Preserve seu sinal.']),
      practice('Calcule antes de resolver', 'Δ = (−3)² − 4 · 1 · 2', 'Quanto vale o discriminante?', ['−17', '1', '5'], 1, ['O quadrado de −3 é +9. Faça 9 − 8.', 'Exato! 9 − 8 = 1 e √Δ = 1.', 'O quadrado é uma multiplicação: (−3) · (−3) = 9. Depois subtraia 8.']),
      practice('Aplique os dois sinais', 'x = (3 ± 1) / 2', 'Quais são as raízes?', ['4 e 2', '−2 e −1', '2 e 1'], 2, ['Falta dividir cada resultado do numerador por 2.', 'O oposto de b = −3 é +3. Os numeradores são 4 e 2.', 'Você conseguiu! (3 + 1)/2 = 2 e (3 − 1)/2 = 1.']),
    ],
  },
  incomplete: {
    title: 'Atalhos para equações incompletas',
    pages: [
      page('Se b = 0, isole x²', 'Sem o termo com x, podemos resolver desfazendo as operações. Observe o coeficiente a ao dividir.', '2x² − 18 = 0\n2x² = 18\nx² = 9\nx = 3 ou x = −3', 'Os dois sinais importam: 3² = 9 e (−3)² = 9. Se x² fosse negativo, não haveria raiz real.'),
      page('Se c = 0, coloque x em evidência', 'Os dois termos têm x. Escreva a equação como produto e iguale cada fator a zero.', 'x² − 4x = 0\nx(x − 4) = 0\nx = 0 ou x − 4 = 0\nx = 0 ou x = 4', 'Não divida tudo por x: x pode ser zero e você perderia essa raiz!'),
      page('Se b e c forem zero', 'Como a ≠ 0, podemos dividir os dois lados por a.', '3x² = 0\nx² = 0\nx = 0', 'Aqui há uma raiz real dupla. Não precisamos de Bhaskara.'),
    ],
    practice: [
      practice('Identifique o termo ausente', 'x² − 6x = 0', 'Quais são os coeficientes?', ['1, −6 e 0', '1, 0 e −6', '1, 6 e 0'], 0, ['Sim, c = 0: não há termo independente.', 'O −6 acompanha x, então é b. O termo independente está ausente.', 'Preserve o sinal: b = −6.']),
      practice('Escolha o método', 'x² − 6x = 0', 'Qual transformação mantém todas as raízes?', ['Dividir por x e usar só x − 6 = 0', 'Fatorar: x(x − 6) = 0', 'Usar x² = 6'], 1, ['Dividir por x descartaria a possibilidade x = 0. Coloque x em evidência.', 'Isso! Mantemos os dois fatores e a possibilidade de x = 0.', 'O termo é 6x. Não podemos apagar esse x ao trocar de lado.']),
      practice('Resolva os fatores', 'x(x − 6) = 0', 'Quais são as raízes?', ['Apenas 6', '−6 e 6', '0 e 6'], 2, ['O primeiro fator também pode ser zero. Inclua x = 0.', 'Raízes opostas são comuns no caso b = 0. Aqui temos c = 0.', 'Correto! x = 0 ou x − 6 = 0, isto é, x = 6.']),
      practice('Pratique também b = 0', 'x² − 16 = 0', 'Isolando x² = 16, quais são as raízes?', ['Apenas 4', '−4 e 4', '0 e 16'], 1, ['(−4)² também é 16. Lembre-se do sinal ±.', 'Exato! Os dois números elevados ao quadrado dão 16.', '16 é o valor de x². Precisamos dos valores cujo quadrado seja 16.']),
    ],
  },
  sumProduct: {
    title: 'Soma e produto das raízes',
    pages: [
      page('Duas relações úteis', 'Podemos conhecer a soma S e o produto P das raízes sem calculá-las separadamente.', 'S = x₁ + x₂ = −b/a\nP = x₁ · x₂ = c/a', 'A soma usa o oposto de b. O produto mantém o sinal de c. Nas fases iniciais, a = 1.'),
      page('Um exemplo com sinais', 'Identifique a = 1, b = −5 e c = 6. As raízes 2 e 3 confirmam as relações.', 'x² − 5x + 6 = 0\nS = −(−5)/1 = 5\nP = 6/1 = 6', '2 + 3 = 5 e 2 · 3 = 6. Leia se a questão pede SOMA ou PRODUTO.'),
    ],
    practice: [practice('Soma ou produto?', 'x² + 3x − 4 = 0', 'Qual é a soma das raízes?', ['3', '−4', '−3'], 2, ['A soma usa −b/a, não b/a. Troque o sinal de b.', '−4 é o produto c/a. A pergunta pede a soma.', 'Isso! S = −3/1 = −3. O produto seria −4.'])],
  },
  vieta: {
    title: 'Reconstrua a equação com Vieta',
    pages: [
      page('Das raízes para a equação', 'Se conhecemos as raízes e escolhemos a = 1, usamos a soma S e o produto P para reconstruir a equação.', 'x² − Sx + P = 0\nx₁ = 2, x₂ = −3\nS = 2 + (−3) = −1\nP = 2 · (−3) = −6', 'Há várias equações com essas raízes, por exemplo multiplicando todos os termos por 2. Aqui usamos a = 1.'),
      page('Cuidado com −S', 'Substitua a soma e o produto na posição certa. Como S = −1, o coeficiente de x é −(−1) = +1.', 'x² − (−1)x + (−6) = 0\nx² + x − 6 = 0', 'Confira a fatoração: (x − 2)(x + 3) = 0.'),
    ],
    practice: [practice('Monte uma equação', 'x₁ = 1 e x₂ = 4', 'S = 5 e P = 4. Qual equação tem a = 1?', ['x² + 5x + 4 = 0', 'x² − 5x + 4 = 0', 'x² − 4x + 5 = 0'], 1, ['Na forma x² − Sx + P = 0, a soma entra com sinal oposto.', 'Exato! (x − 1)(x − 4) = x² − 5x + 4.', 'A soma acompanha x com sinal oposto; o produto fica sozinho.'])],
  },
  bhaskaraAdvanced: {
    title: 'Bhaskara quando a > 1',
    pages: [
      page('O denominador também muda', 'Não basta dividir por 2. O denominador é sempre 2 · a, e divide todo o numerador.', '2x² − 6x + 4 = 0\na = 2, b = −6, c = 4\nΔ = (−6)² − 4 · 2 · 4 = 36 − 32 = 4', 'Antes de calcular, você também pode dividir TODOS os termos por 2 e resolver x² − 3x + 2 = 0.'),
      page('Duas contas, o mesmo denominador', '√4 = 2 e 2a = 4. Use os dois sinais e divida cada numerador por 4.', 'x = (6 ± 2)/4\nx₁ = 8/4 = 2\nx₂ = 4/4 = 1', 'Confira x = 2: 2 · 4 − 6 · 2 + 4 = 8 − 12 + 4 = 0.'),
    ],
    practice: [practice('Não esqueça o a', '3x² − 9x + 6 = 0\nΔ = 81 − 72 = 9', 'Qual substituição de Bhaskara está correta?', ['x = (9 ± 3)/2', 'x = (−9 ± 3)/6', 'x = (9 ± 3)/6'], 2, ['O denominador é 2 · a = 2 · 3 = 6.', 'Como b = −9, o oposto −b é +9.', 'Isso! As raízes são 12/6 = 2 e 6/6 = 1.'])],
  },
  deltaPositive: {
    title: 'Delta positivo: duas raízes distintas',
    pages: [page('Duas possibilidades reais', 'Quando Δ é positivo, √Δ é maior que zero. Somar ou subtrair esse valor em Bhaskara produz duas raízes diferentes.', 'x² − 5x + 6 = 0\nΔ = 25 − 24 = 1 > 0\nx = (5 ± 1)/2 → 3 ou 2', 'Saber que Δ > 0 informa a quantidade de raízes, mas não seus valores.', 'delta')],
    practice: [practice('Interprete o resultado', 'x² − x − 2 = 0\nΔ = (−1)² − 4 · 1 · (−2) = 9', 'O que podemos afirmar?', ['Duas raízes reais diferentes', 'Uma raiz real dupla', 'Nenhuma raiz real'], 0, ['Sim! Δ = 9 > 0, então há duas raízes reais distintas.', 'Uma raiz dupla exige Δ = 0. Compare 9 com zero.', 'Nenhuma raiz real exige Δ < 0. Aqui Δ é positivo.'])],
  },
  deltaZero: {
    title: 'Delta zero: uma raiz dupla',
    pages: [page('Os dois caminhos chegam ao mesmo valor', 'Se Δ = 0, então √Δ = 0. Somar zero e subtrair zero dão o mesmo resultado: uma raiz real dupla.', 'x² − 6x + 9 = 0\nΔ = 36 − 36 = 0\nx = (6 ± 0)/2 = 3', '“Dupla” não significa dois números diferentes. A fatoração é (x − 3)² = 0.', 'delta')],
    practice: [practice('Conte e calcule', 'x² + 4x + 4 = 0\nΔ = 16 − 16 = 0', 'Como são as raízes?', ['Duas raízes distintas', 'Uma raiz dupla, x = −2', 'Uma raiz dupla, x = 2'], 1, ['Com √Δ = 0, os sinais + e − levam ao mesmo número.', 'Correto! x = −b/(2a) = −4/2 = −2.', 'Lembre-se do oposto de b: −b = −4. Depois divida por 2.'])],
  },
  deltaNegative: {
    title: 'Delta negativo: nenhuma raiz real',
    pages: [page('Quando paramos a conta?', 'O quadrado de um número real nunca é negativo. Por isso, se Δ < 0, não conseguimos calcular √Δ nos números reais.', 'x² + 2x + 5 = 0\nΔ = 4 − 20 = −16 < 0', 'Não precisamos continuar com Bhaskara. A equação não possui raízes reais.', 'delta')],
    practice: [practice('Investigue as raízes', 'x² + 1 = 0\na = 1, b = 0, c = 1', 'Δ = 0² − 4 · 1 · 1 = −4. Qual a conclusão?', ['Uma raiz igual a zero', 'Duas raízes reais', 'Nenhuma raiz real'], 2, ['b = 0 não significa raiz zero. Zero só satisfaz a equação se c = 0.', 'Duas raízes reais distintas exigem Δ positivo.', 'Isso! Nenhum número real ao quadrado é −1; Δ negativo confirma essa impossibilidade.'])],
  },
  applied: {
    title: 'Da história para a equação',
    pages: [
      page('Leia o que cada medida representa', 'Um jardim de Numeria tem largura x e comprimento x + 2. Sua área é 15 m². Área de retângulo = largura · comprimento.', 'x(x + 2) = 15\nx² + 2x − 15 = 0', 'A pergunta é a largura x, não o comprimento x + 2.', 'rectangle'),
      page('Resolva e interprete', 'Procure dois números com soma −2 e produto −15: são 3 e −5. Fatorar ou usar Bhaskara dá as mesmas soluções.', '(x − 3)(x + 5) = 0\nx = 3 ou x = −5', 'Uma largura precisa ser positiva. Descartamos −5. Largura = 3 m e comprimento = 5 m. Confira: 3 · 5 = 15 m².'),
    ],
    practice: [
      practice('Modele o problema', 'Largura x, comprimento x + 2, área 24 m².', 'Qual equação representa a área?', ['x² + 2x − 24 = 0', 'x + (x + 2) = 24', 'x² + 2 − 24 = 0'], 0, ['Isso! x(x + 2) = 24, então x² + 2x − 24 = 0.', 'A área é um produto das medidas, não sua soma.', 'Distribua x: x · (x + 2) = x² + 2x.']),
      practice('Prepare a resolução', 'x² + 2x − 24 = 0', 'Qual é a identificação de coeficientes?', ['a = 1, b = 2, c = −24', 'a = 1, b = 2, c = 24', 'a = 1, b = 0, c = −24'], 0, ['Correto. Agora procure uma fatoração ou calcule Δ.', 'O termo independente inclui o sinal de menos: c = −24.', 'O termo 2x está presente: b = 2.']),
      practice('Escolha o caminho', 'x² + 2x − 24 = 0', 'Qual produto equivale ao lado esquerdo?', ['(x − 4)(x + 6)', '(x + 4)(x − 6)', 'x(x + 2)'], 0, ['Exato: 6x − 4x = 2x e (−4) · 6 = −24.', 'Esse produto gera −2x. Precisamos de +2x.', 'Falta o termo −24 para a igualdade com zero.']),
      practice('Responda ao enunciado', '(x − 4)(x + 6) = 0 → x = 4 ou x = −6', 'Qual é a largura do retângulo?', ['6 m', '−6 m', '4 m'], 2, ['6 m é o comprimento x + 2. A pergunta pede a largura x.', 'A solução −6 vale para a equação, mas uma largura não pode ser negativa.', 'Muito bem! Largura 4 m e comprimento 6 m. A área é 4 · 6 = 24 m².']),
    ],
  },
  simplification: {
    title: 'Simplifique pelo fator comum',
    pages: [
      page('Números menores, mesmas raízes', 'Se todos os termos têm um fator comum diferente de zero, divida os DOIS lados por ele. Isso preserva a igualdade e as raízes.', '2x² − 10x + 12 = 0\nDividindo tudo por 2:\nx² − 5x + 6 = 0', 'Divida cada termo: 2/2 = 1, −10/2 = −5, 12/2 = 6 e 0/2 = 0.'),
      page('Resolva a equação simplificada', 'Agora procure dois números cuja soma seja 5 e cujo produto seja 6. São 2 e 3.', '(x − 2)(x − 3) = 0\nx = 2 ou x = 3', 'Não multiplique as raízes por 2 no final. Elas já resolvem a equação original.'),
    ],
    practice: [practice('Divida todos os termos', '3x² − 21x + 36 = 0', 'Ao dividir por 3, qual equação obtemos?', ['x² − 21x + 36 = 0', 'x² − 7x + 12 = 0', 'x² − 7x + 36 = 0'], 1, ['É preciso dividir também −21x e +36 pelo mesmo número.', 'Isso! As raízes são 3 e 4, tanto na original quanto na simplificada.', 'O termo independente também é dividido: 36/3 = 12.'])],
  },
  rootProperties: {
    title: 'Raízes simétricas e inversas',
    pages: [
      page('Simétricas: opostas na reta', 'Duas raízes não nulas são simétricas quando uma é o oposto da outra, como −3 e 3. A soma é zero; por S = −b/a, temos b = 0.', 'x² − 9 = 0 → −3 e 3\nb = 0 e a · c < 0', 'a · c < 0 garante x² = −c/a > 0 e duas raízes reais não nulas. Se c = 0 também, a raiz dupla é zero.'),
      page('Inversas: o produto vale 1', 'Duas raízes são inversas quando seu produto é 1, como 1/2 e 2. Como P = c/a, isso exige a = c ≠ 0.', '2x² − 5x + 2 = 0\nx₁ = 1/2 e x₂ = 2\nP = c/a = 2/2 = 1', 'Para que essas raízes sejam reais, verifique também Δ ≥ 0. Só a = c não garante que existam raízes reais.'),
    ],
    practice: [practice('Compare as propriedades', 'x₁ = 1/3 e x₂ = 3', 'Essas raízes são…', ['Simétricas: a soma é zero', 'Inversas: o produto é 1', 'Iguais: a diferença é zero'], 1, ['A soma 1/3 + 3 não é zero. Simétricas são números opostos.', 'Exato! (1/3) · 3 = 1. Elas são inversas.', '1/3 e 3 são valores diferentes. Observe seu produto.'])],
  },
};

// Inclui todas as possibilidades dos geradores mistos, mesmo que não sejam
// sorteadas na tentativa atual. A ordem mantém os pré-requisitos antes do uso.
export const LEVEL_TUTORIALS = {
  '0-0': ['introduction', 'coefficients', 'factoring'],
  '0-1': ['introduction', 'coefficients', 'delta'],
  '0-2': ['introduction', 'coefficients', 'sumProduct'],
  '0-3': ['introduction', 'coefficients', 'delta', 'bhaskara'],
  '0-4': ['introduction', 'coefficients', 'factoring', 'delta', 'sumProduct', 'bhaskara'],
  '1-0': ['introduction', 'coefficients'],
  '1-1': ['introduction', 'coefficients', 'sumProduct', 'vieta'],
  '1-2': ['introduction', 'coefficients', 'incomplete'],
  '1-3': ['introduction', 'coefficients', 'delta', 'bhaskara', 'bhaskaraAdvanced'],
  '1-4': ['introduction', 'coefficients', 'sumProduct', 'vieta', 'incomplete', 'delta', 'bhaskara', 'bhaskaraAdvanced'],
  '2-0': ['introduction', 'coefficients', 'delta', 'deltaPositive'],
  '2-1': ['introduction', 'coefficients', 'delta', 'bhaskara', 'deltaZero'],
  '2-2': ['introduction', 'coefficients', 'delta', 'deltaNegative'],
  '2-3': ['introduction', 'coefficients', 'delta', 'bhaskara', 'deltaPositive', 'deltaZero', 'deltaNegative'],
  '2-4': ['introduction', 'coefficients', 'delta', 'bhaskara', 'deltaPositive', 'deltaZero', 'deltaNegative'],
  '3-0': ['introduction', 'coefficients', 'factoring', 'applied'],
  '3-1': ['introduction', 'coefficients', 'factoring', 'simplification'],
  '3-2': ['introduction', 'coefficients', 'sumProduct', 'delta', 'incomplete', 'rootProperties'],
  '3-3': ['introduction', 'coefficients', 'factoring', 'applied', 'simplification', 'sumProduct', 'delta', 'incomplete', 'rootProperties', 'bhaskara', 'bhaskaraAdvanced'],
  '3-4': ['introduction', 'coefficients', 'factoring', 'applied', 'simplification', 'sumProduct', 'delta', 'incomplete', 'rootProperties', 'bhaskara', 'bhaskaraAdvanced', 'deltaZero'],
};

export const TOPIC_TUTORIAL = {
  'Raízes Simples e Fatoração': 'factoring',
  'Discriminante (Delta)': 'delta',
  'Soma e Produto': 'sumProduct',
  'Bhaskara I': 'bhaskara',
  'Identificando Coeficientes': 'coefficients',
  'Relações de Vieta': 'vieta',
  'Equações Incompletas (c = 0)': 'incomplete',
  'Equações Incompletas (b = 0)': 'incomplete',
  'Bhaskara com a > 1': 'bhaskaraAdvanced',
  'Delta Positivo': 'deltaPositive',
  'Delta Zero (Raiz Dupla)': 'deltaZero',
  'Delta Negativo': 'deltaNegative',
  'Problemas Aplicados': 'applied',
  'Simplificação por Fator Comum': 'simplification',
  'Raízes Simétricas': 'rootProperties',
  'Raízes Inversas': 'rootProperties',
};
