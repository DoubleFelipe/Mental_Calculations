# Preparação educativa das fases

O tutorial é apresentado na entrada do **quiz**, depois da conversa com o guardião e antes de iniciar o cronômetro e a tentativa online. Assim, a exploração da plataforma e os diálogos de Numeria continuam com seu fluxo original.

Cada conteúdo novo tem cartões curtos, exemplos resolvidos e prática com feedback específico para cada alternativa. O aluno pode tentar novamente sem perder vidas, créditos ou pontos. A navegação só avança depois de acertar a prática. Ao concluir a preparação, o jogador inicia o desafio no botão **Começar**.

## Organização

- `src/data/tutorials.js`: lições, exemplos, exercícios, relação entre tópicos e lições e mapa das 20 fases.
- `src/models/TutorialModel.js`: consulta de conteúdos pendentes, conclusão imutável por jogador e dicas progressivas.
- `src/views/components/Tutorial/`: cartões reutilizáveis e ajuda das questões.
- `GameController`: persistência através de `mc_game_state`.
- `Quiz` e `useQuizController`: preparação, consulta, pausa e início da tentativa.

Arquivos criados: `src/data/tutorials.js`, `src/models/TutorialModel.js`, `src/views/components/Tutorial/Tutorial.jsx`, `src/views/components/Tutorial/Tutorial.css`, `src/views/components/Tutorial/QuestionHelp.jsx`, `tests/tutorial.test.js`, `tests/fixtures/tutorial.html`, `tests/fixtures/tutorial-harness.jsx` e este documento.

Arquivos atualizados: `src/controllers/GameController.jsx`, `src/controllers/useQuizController.js`, `src/models/GameModel.js`, `src/views/pages/Quiz/Quiz.jsx`, `src/views/pages/Quiz/Quiz.css`, `src/services/mathGenerator.js`, `package.json` e `README.md`. No gerador, foram esclarecidos apenas os enunciados das condições para raízes simétricas não nulas e inversas reais.

## Conteúdos por fase

Toda fase inclui introdução e coeficientes como pré-requisitos. Os conteúdos já concluídos deixam de ser obrigatórios. Os desafios mistos incluem todas as possibilidades do gerador, mesmo quando um tópico não é sorteado naquela tentativa.

| Mundo | Fase | Conteúdo específico |
| --- | --- | --- |
| Equações | Raízes Simples | Raiz, conferência por substituição, fatoração e raiz dupla |
| Equações | Discriminante | Cálculo de Δ e significado dos três sinais |
| Equações | Soma e Produto | S = −b/a e P = c/a |
| Equações | Bhaskara I | Δ, substituição e resolução com os dois sinais |
| Equações | Desafio Final | Revisão dos quatro conteúdos do mundo |
| Coeficientes | Identificando Coeficientes | Sinais, termos desordenados e igualdade com termos dos dois lados |
| Coeficientes | Vieta | Soma/produto e reconstrução com a = 1 |
| Coeficientes | Incompletas | b = 0, c = 0 e b = c = 0 |
| Coeficientes | Bhaskara II | Δ, Bhaskara e denominador 2a com a > 1 |
| Coeficientes | Desafio Final | Revisão de todos os conteúdos do mundo |
| Delta | Positivo | Duas raízes reais distintas |
| Delta | Zero | Raiz real dupla e cálculo de −b/(2a) |
| Delta | Negativo | Ausência de raízes reais |
| Delta | Classificação e Final | Comparação dos três casos e cálculo da raiz dupla |
| Mestres | Problemas Aplicados | Área do retângulo, modelagem, resolução e interpretação da medida |
| Mestres | Coeficientes Grandes | Divisão de todos os termos por fator comum e fatoração |
| Mestres | Raízes Inversas | Raízes simétricas, inversas e condições de existência real |
| Mestres | Miscelânea | Aplicações, simplificação, propriedades e Bhaskara II |
| Mestres | Supremo | Conteúdos da miscelânea e raiz dupla |

## Ajuda e tempo

**Rever explicação** abre o conteúdo da questão atual, com seletor para os outros conteúdos da fase. A consulta pausa o tempo e preserva a questão e as alternativas. Os exemplos da consulta são independentes da pergunta sorteada.

**Preciso de uma dica** revela até três orientações de processo, uma por vez, sem custo e sem fornecer as raízes ou eliminar alternativas. As dicas reiniciam em cada questão e na rodada de fixação. O diagnóstico da alternativa errada e a resolução completa existentes continuam disponíveis após a resposta.

Estudo e quadro de apoio compartilham a decisão de pausa. Fechar uma consulta enquanto o quadro está aberto mantém o tempo pausado. O modo aprendiz continua sem contagem regressiva. O tempo da consulta e do quadro fica fora do tempo de resolução usado na pontuação.

## Persistência e compatibilidade

`gameState.tutorials.completedByPlayer[playerKey][lessonId]` armazena a versão concluída. As chaves de jogador usam a mesma convenção da narrativa (`guest` ou `user:<id>`). Saves anteriores sem o campo são aceitos; vidas, estrelas, inventário, história e créditos são preservados. A sincronização do servidor mantém esse campo local, pois já mescla o estado anterior.

A conclusão é salva apenas depois de terminar toda a sequência obrigatória; sair antes permite retomá-la pela preparação. A revisão é opcional e pode ser fechada a qualquer momento. O reset geral já existente limpa também a conclusão dos tutoriais. Incrementar `TUTORIAL_VERSION` reapresenta o conteúdo atualizado.

O registro dos tutoriais é **local a este navegador/dispositivo**, inclusive para contas autenticadas. Não há alteração no esquema ou nos contratos da API. Em outro dispositivo, a preparação será apresentada novamente.

## Validação

```bash
npm test
npm run lint
npm run build
```

Os testes verificam saves antigos, isolamento entre jogadores, serialização, versionamento, preservação da conclusão após resultados, pré-requisitos, conteúdo de todas as fases e dicas dos tópicos sorteados. A amostragem determinística percorre 2.400 questões das 20 fases; verifica também discriminantes e raízes do gerador. As igualdades numéricas dos exemplos são verificadas diretamente nas fórmulas usadas pelos cartões.

Para testar a interface sem percorrer a plataforma, use a bancada fora do bundle de produção em uma **porta exclusiva**, evitando compartilhar o armazenamento do jogo normal:

```bash
npm run dev -- --host 127.0.0.1 --port 5187
```

Abra `http://127.0.0.1:5187/tests/fixtures/tutorial.html`. O seletor abre as 20 fases reais com o mesmo provider e controlador do jogo. **Reabrir fase** verifica que a conclusão não é exigida novamente. A bancada mostra o resultado sem conceder recompensas e permite testar saída, repescagem, revisão, modo aprendiz, quadro, feedback e tamanhos de tela.

### Verificações de interface realizadas

- Entrada nas 20 fases, com seleção contextual e supressão de pré-requisitos já concluídos.
- Sequências completas de introdução, coeficientes, fatoração, delta, Bhaskara, incompletas e problemas aplicados.
- Resposta errada com orientação, nova tentativa, navegação para trás mantendo a prática respondida e conclusão.
- Retorno à preparação sem concluir: **Começar** permanece desabilitado. Após concluir e recarregar, o conteúdo deixa de ser obrigatório.
- Três dicas progressivas, consulta por seletor, pausa sem perda de segundos e preservação dos campos do quadro e das dicas.
- Partida completa em modo aprendiz com erro proposital, diagnóstico, consulta da resolução e rodada de fixação, terminando em 5/5.
- Layouts de 1366 × 900, 768 × 1024 e 390 × 844; fórmulas e cartões inspecionados visualmente e ausência de rolagem horizontal nas larguras de tablet e celular.

Essas verificações usam o frontend local em modo convidado, sem acesso a contas ou banco de produção. A sincronização autenticada não foi exercitada no navegador; seus contratos e tabelas permanecem iguais.
