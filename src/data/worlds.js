/**
 * Mental Calculations — Dados dos Mundos
 */
const worlds = [
  {
    id: 0,
    name: 'Mundo das Equações',
    subtitle: 'Primeiros passos com equações do 2º grau',
    color: '#4CAF50',
    icon: '🌿',
    levels: [
      { id: 0, name: 'Raízes Simples', questionsCount: 5 },
      { id: 1, name: 'Discriminante', questionsCount: 5 },
      { id: 2, name: 'Soma e Produto', questionsCount: 5 },
      { id: 3, name: 'Bhaskara I', questionsCount: 5 },
      { id: 4, name: 'Desafio Final', questionsCount: 7 },
    ],
  },
  {
    id: 1,
    name: 'Mundo dos Coeficientes',
    subtitle: 'Dominando a, b e c',
    color: '#42A5F5',
    icon: '🌊',
    levels: [
      { id: 0, name: 'Identificando Coeficientes', questionsCount: 5 },
      { id: 1, name: 'Relações de Vieta', questionsCount: 5 },
      { id: 2, name: 'Equações Incompletas', questionsCount: 5 },
      { id: 3, name: 'Bhaskara II', questionsCount: 5 },
      { id: 4, name: 'Desafio Final', questionsCount: 7 },
    ],
  },
  {
    id: 2,
    name: 'Mundo do Delta',
    subtitle: 'Explorando o discriminante',
    color: '#FFD54F',
    icon: '⚡',
    levels: [
      { id: 0, name: 'Delta Positivo', questionsCount: 5 },
      { id: 1, name: 'Delta Zero', questionsCount: 5 },
      { id: 2, name: 'Delta Negativo', questionsCount: 5 },
      { id: 3, name: 'Classificação', questionsCount: 5 },
      { id: 4, name: 'Desafio Final', questionsCount: 7 },
    ],
  },
  {
    id: 3,
    name: 'Mundo dos Mestres',
    subtitle: 'Para verdadeiros gênios!',
    color: '#EF5350',
    icon: '🔥',
    levels: [
      { id: 0, name: 'Problemas Aplicados', questionsCount: 5 },
      { id: 1, name: 'Coeficientes Grandes', questionsCount: 5 },
      { id: 2, name: 'Raízes Inversas', questionsCount: 5 },
      { id: 3, name: 'Miscelânea', questionsCount: 5 },
      { id: 4, name: 'Desafio Supremo', questionsCount: 10 },
    ],
  },
];

export default worlds;
