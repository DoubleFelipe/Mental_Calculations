# Verificação de Numeria

## Arquitetura examinada antes das alterações

React/Vite; estado central em GameController/GameModel; dados de quatro mundos com cinco fases; motor Canvas com física, elevadores, plataformas móveis, perigos, skins, sacos e câmaras secretas; quiz com cronômetro, apoio, power-ups e revisão; perfil/configurações/loja; API Express/Sequelize com tentativas, seeds e desbloqueios. Os mapas eram acessos a quizzes de equações quadráticas. A integração mantém a física e os recursos existentes, acrescentando a campanha ao mapa e deixando o quiz como treino.

## Testes automatizados executados

Os testes de `tests/adventure.test.js` simulam aprovação e reprovação, percorrem as 25 fases pelo modelo de progresso, verificam os sete marcos e sua persistência após serialização, conferem âncoras de plataformas para todos os selos e geram 2.500 questões com alternativas únicas e conferem numericamente operações, equações e medidas geométricas. Essa simulação não equivale a jogar todos os mapas com colisões e controles reais.

## Interface verificada no navegador local

- Entrada na abertura, avanço de diálogo e pulo para a seleção de mundos.
- Entrada na floresta, orientação da mentora e diário/HUD.
- Layout em 390 × 844 e 1280 × 800.
- Movimento, salto até a primeira plataforma, coleta de moedas e interação com o primeiro selo.
- Resposta incorreta, explicação educativa, nova tentativa, resposta correta e avanço do objetivo para o segundo selo.
- Recarregamento da página e retomada do segundo selo, moedas e introdução já vista; abertura do diário e da introdução do treino.

## Limites de validação

A campanha inteira e os chefes foram verificados por simulação das regras; não houve uma partida manual completa pelos cinco mapas. Os testes de âncoras não provam a alcançabilidade física de cada salto. A migração e a sincronização com um MySQL real não foram executadas nesta entrega. O funcionamento dos controles em hardware touch e o equilíbrio da dificuldade ainda precisam de sessões de jogo em dispositivos reais. Os saves parciais da narrativa são locais; estrelas e fragmentos de fases concluídas seguem a sincronização já existente.
