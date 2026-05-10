/**
 * Mental Calculations — Itens da Loja
 */
const shopItems = [
  // === Skins ===
  { id: 'skin_ninja', type: 'skin', name: 'Ninja Matemático', price: 200, icon: '🥷', description: 'Skin de ninja ágil', color: '#333' },
  { id: 'skin_astronaut', type: 'skin', name: 'Astronauta', price: 300, icon: '🧑‍🚀', description: 'Explore o espaço dos números', color: '#1976D2' },
  { id: 'skin_wizard', type: 'skin', name: 'Mago dos Números', price: 250, icon: '🧙', description: 'Conjure equações com magia', color: '#7B1FA2' },
  { id: 'skin_robot', type: 'skin', name: 'Robô Calculador', price: 350, icon: '🤖', description: 'Processamento máximo!', color: '#455A64' },
  { id: 'skin_superhero', type: 'skin', name: 'Super Herói', price: 400, icon: '🦸', description: 'Poder de cálculo sobre-humano', color: '#D32F2F' },

  // === Power-ups ===
  { id: 'item_hint', type: 'powerup', name: 'Dica Mágica', price: 50, icon: '💡', description: 'Elimina 2 alternativas erradas', uses: 3 },
  { id: 'item_time', type: 'powerup', name: 'Tempo Extra', price: 75, icon: '⏰', description: '+15 segundos no timer', uses: 3 },
  { id: 'item_shield', type: 'powerup', name: 'Escudo', price: 100, icon: '🛡️', description: 'Protege contra 1 erro', uses: 1 },
  { id: 'item_double', type: 'powerup', name: 'Crédito Duplo', price: 150, icon: '✨', description: 'Dobra créditos da próxima fase', uses: 1 },

  // === Pacotes de Créditos (simulados) ===
  { id: 'pack_small', type: 'credit_pack', name: 'Pacote Iniciante', price: 0, realPrice: 'R$ 4,99', credits: 200, icon: '💰', description: '200 créditos' },
  { id: 'pack_medium', type: 'credit_pack', name: 'Pacote Estudante', price: 0, realPrice: 'R$ 9,99', credits: 500, icon: '💎', description: '500 créditos' },
  { id: 'pack_large', type: 'credit_pack', name: 'Pacote Gênio', price: 0, realPrice: 'R$ 19,99', credits: 1200, icon: '👑', description: '1200 créditos' },
];

export default shopItems;
