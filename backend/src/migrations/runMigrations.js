'use strict';
/**
 * Mental Calculations — Migration + Seeds
 * Cria todas as tabelas e insere dados estáticos iniciais.
 * Execute com: node src/migrations/runMigrations.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Importar todos os models para registrar no Sequelize
require('../models/index');

async function runMigrations() {
  try {
    console.log('🔄 Iniciando migrations...');

    // Sincronizar todos os models com o banco (CREATE TABLE IF NOT EXISTS)
    await sequelize.sync({ alter: false, force: false });
    await ensureAuthColumns();
    console.log('✅ Tabelas criadas com sucesso!');

    // Executar seeds
    await seedWorlds();
    await seedLevels();
    await seedShopItems();

    console.log('✅ Seeds inseridos com sucesso!');
    console.log('🎉 Migration completa!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migration:', error);
    process.exit(1);
  }
}

async function ensureAuthColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const tableNames = tables.map((table) => (
    typeof table === 'string' ? table : table.tableName || table.table_name
  ));
  if (!tableNames.includes('users')) return;

  const usersTable = await queryInterface.describeTable('users');

  if (usersTable.google_id && usersTable.google_id.allowNull === false) {
    await queryInterface.changeColumn('users', 'google_id', {
      type: DataTypes.STRING(100),
      allowNull: true,
    });
    console.log('  -> users.google_id agora aceita contas sem Google');
  }

  if (!usersTable.password_hash) {
    await queryInterface.addColumn('users', 'password_hash', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
    console.log('  -> users.password_hash criado');
  }
}

async function seedWorlds() {
  const { World } = require('../models/index');
  const { default: definitions } = await import('../../../src/data/worlds.js');
  const worlds = definitions.map(w => ({id:w.id+1,name:w.name,subtitle:w.subtitle,color_hex:w.color,icon:w.icon,sort_order:w.id}));
  for (const world of worlds) {
    await World.upsert(world);
  }
  console.log('  → Worlds inseridos');
}

async function seedLevels() {
  const { Level } = require('../models/index');
  // Mapeamento de dificuldades por mundo (worldIndex) e fase (levelIndex)
  const difficultyMap = [
    ['easy', 'easy', 'medium', 'medium', 'hard'],
    ['easy', 'medium', 'medium', 'hard', 'hard'],
    ['medium', 'medium', 'hard', 'hard', 'hard'],
    ['medium', 'hard', 'hard', 'hard', 'hard'],
  ];
  const { default: definitions } = await import('../../../src/data/worlds.js');
  let levelId = 1;
  for (let wi = 0; wi < definitions.length; wi++) {
    for (let li = 0; li < 5; li++) {
      await Level.upsert({
        id: levelId,
        world_id: wi + 1,
        name: definitions[wi].levels[li].name,
        questions_count: definitions[wi].levels[li].questionsCount,
        difficulty: (difficultyMap[wi] || difficultyMap[3])[li],
        sort_order: li,
      });
      levelId++;
    }
  }
  console.log('  → Levels inseridos (25 fases)');
}

async function seedShopItems() {
  const { ShopItem } = require('../models/index');
  const items = [
    // Skins
    { id: 1,  item_key: 'skin_ninja',      type: 'skin',        name: 'Ninja Matemático',  icon: '🥷',  description: 'Skin de ninja ágil',                  credit_price: 200, real_price: null,       uses: 0 },
    { id: 2,  item_key: 'skin_astronaut',  type: 'skin',        name: 'Astronauta',         icon: '🧑‍🚀', description: 'Explore o espaço dos números',          credit_price: 300, real_price: null,       uses: 0 },
    { id: 3,  item_key: 'skin_wizard',     type: 'skin',        name: 'Mago dos Números',   icon: '🧙',  description: 'Conjure equações com magia',            credit_price: 250, real_price: null,       uses: 0 },
    { id: 4,  item_key: 'skin_robot',      type: 'skin',        name: 'Robô Calculador',    icon: '🤖',  description: 'Processamento máximo!',                 credit_price: 350, real_price: null,       uses: 0 },
    { id: 5,  item_key: 'skin_superhero',  type: 'skin',        name: 'Super Herói',        icon: '🦸',  description: 'Poder de cálculo sobre-humano',         credit_price: 400, real_price: null,       uses: 0 },
    // Power-ups
    { id: 6,  item_key: 'item_hint',       type: 'powerup',     name: 'Dica Mágica',        icon: '💡',  description: 'Elimina 2 alternativas erradas',        credit_price: 50,  real_price: null,       uses: 3 },
    { id: 7,  item_key: 'item_time',       type: 'powerup',     name: 'Tempo Extra',        icon: '⏰',  description: '+15 segundos no timer',                 credit_price: 75,  real_price: null,       uses: 3 },
    { id: 8,  item_key: 'item_shield',     type: 'powerup',     name: 'Escudo',             icon: '🛡️',  description: 'Protege contra 1 erro',                 credit_price: 100, real_price: null,       uses: 1 },
    { id: 9,  item_key: 'item_double',     type: 'powerup',     name: 'Crédito Duplo',      icon: '✨',  description: 'Dobra créditos da próxima fase',        credit_price: 150, real_price: null,       uses: 1 },
    // Pacotes de Crédito
    { id: 10, item_key: 'pack_small',      type: 'credit_pack', name: 'Pacote Iniciante',   icon: '💰',  description: '200 créditos',                          credit_price: 0,   real_price: 'R$ 4,99',  uses: 0 },
    { id: 11, item_key: 'pack_medium',     type: 'credit_pack', name: 'Pacote Estudante',   icon: '💎',  description: '500 créditos',                          credit_price: 0,   real_price: 'R$ 9,99',  uses: 0 },
    { id: 12, item_key: 'pack_large',      type: 'credit_pack', name: 'Pacote Gênio',       icon: '👑',  description: '1200 créditos',                         credit_price: 0,   real_price: 'R$ 19,99', uses: 0 },
  ];
  for (const item of items) {
    await ShopItem.upsert(item);
  }
  console.log('  → ShopItems inseridos (12 itens)');
}

runMigrations();
