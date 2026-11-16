/** Numeria: stable world/level IDs preserve existing saves and API references. */
const definitions = [
  ['Floresta das Somas', 'Restaure os caminhos vivos com adição e subtração.', '#66BB6A', '🌿', 'Goblin da Confusão', ['Portão das Raízes', 'Pontes de Folhas', 'Clareira do Fragmento', 'Trilha dos Enigmas', 'Goblin da Confusão']],
  ['Cavernas da Multiplicação', 'Desperte cristais com tabuadas e múltiplos fatores.', '#80DEEA', '💎', 'Aranha dos Fatores', ['Cristais Adormecidos', 'Galeria da Tabuada', 'Núcleo de Cristal', 'Combinações de Pedra', 'Aranha dos Fatores']],
  ['Deserto das Frações', 'Reconstrua pontes de areia e decifre ruínas.', '#FFD54F', '🏜️', 'Escorpião Decimal', ['Partes da Areia', 'Templo da Simplificação', 'Balança das Frações', 'Ruínas Equivalentes', 'Escorpião Decimal']],
  ['Torre da Álgebra', 'Encontre incógnitas e mova os mecanismos da torre.', '#B39DDB', '🔮', 'Mestre X', ['Porta da Incógnita', 'Engrenagens de X', 'Escada das Expressões', 'Equilíbrio da Torre', 'Mestre X']],
  ['Reino Geométrico', 'Dê forma ao reino e alcance o Templo dos Números.', '#F48FB1', '🔷', 'Zero Absoluto', ['Jardim das Formas', 'Muralhas do Perímetro', 'Praça das Áreas', 'Santuário do Coração', 'Zero Absoluto']],
];
const worlds = definitions.map(([name, subtitle, color, icon, boss, names], id) => ({
  id, name, subtitle, color, icon, boss,
  levels: names.map((name, idLevel) => ({ id: idLevel, name, questionsCount: idLevel === 4 ? (id === 4 ? 6 : id === 3 ? 10 : 7) : 5 })),
}));
export default worlds;
