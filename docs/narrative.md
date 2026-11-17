# Narrativa de Numeria

A história usa os quatro mundos, vinte fases, personagens e resultados existentes. `data/story.js` contém o roteiro; `models/StoryModel.js` lê o progresso sem modificá-lo; `views/components/Story` apresenta as cenas e o Coração. Não há novo sistema de combate ou de recompensas.

## Integração

- Menu: Jogar mantém o destino de seleção de mundos; a introdução aparece ali uma vez por jogador/dispositivo. O diário permite rever a introdução e o final.
- Mundos: objetivos no seletor e orientação da Mestra Álgebra na primeira entrada de cada mundo. O mapa fica pausado enquanto há diálogo.
- NPCs: os cinco personagens de cada mundo mantêm posições, aparência, fases e orientações de percurso, agora acompanhadas de contexto. Os textos de Delta foram alinhados aos nomes das fases, pois as dicas antigas estavam deslocadas. O jogador avança o diálogo e inicia o mesmo quiz, ou volta ao mapa. Fases bloqueadas continuam bloqueadas.
- Questões: o contexto entra na introdução já existente. O Desafio Supremo recebe um banner com Zero Absoluto e reações visuais aos acertos/erros. Geração, correção, cronômetro, revisão, quadro de apoio, power-ups e critérios são os originais.
- Resultados: fragmentos e final são apresentados depois da resolução bem-sucedida do resultado, inclusive da resposta da API quando houver tentativa online. Erros de salvamento e reprovações não iniciam cenas de conquista.
- Loja, créditos, pontuação, autenticação, servidor e banco de dados não foram alterados.

## Fragmentos

| Fragmento | Mundo | Fase existente |
| --- | --- | --- |
| Raízes | Equações | 2 — Discriminante |
| Equilíbrio | Equações | 5 — Desafio Final |
| Marés | Coeficientes | 2 — Relações de Vieta |
| Orientação | Coeficientes | 5 — Desafio Final |
| Centelha | Delta | 2 — Delta Zero |
| Harmonia | Delta | 5 — Desafio Final |
| Coragem | Mestres | 4 — Miscelânea |

Os sete fragmentos são obtidos antes da quinta fase dos Mestres. A aprovação no Desafio Supremo apresenta a derrota de Zero Absoluto, a restauração de Numeria e o reconhecimento de Léo.

## Persistência e compatibilidade

Os fragmentos e a conclusão da aventura são derivados de `levelStars`, que já é persistido localmente e sincronizado com o servidor. Isso reconhece conquistas anteriores e evita duplicar ou desatualizar recompensas. `completedLevels` não é usado: o modelo local também marca tentativas reprovadas nesse campo.

As cenas vistas são adicionadas a `mc_game_state.story.viewedByPlayer`, usando `guest` ou `user:<id>`. Os demais dados são preservados. Saves antigos sem `story` funcionam sem migração; eventos não vistos reaparecem ao voltar aos mundos. Resetar Progresso limpa também as cenas vistas. Rever pelo diário não altera conquistas.

Como não existe um campo narrativo na API atual, as **cenas vistas ficam neste dispositivo**. Em outro dispositivo, os fragmentos são reconstruídos das estrelas sincronizadas, mas introdução e eventos podem ser apresentados novamente. As regras atuais de compartilhamento do progresso de gameplay entre sessões locais não foram modificadas.

## Verificação

`npm run test:story` verifica os vinte avanços, reprovações, sete marcos, final, dados antigos, serialização, separação das cenas por jogador e contexto dos NPCs. `npm run lint` e `npm run build` verificam integração e compilação.

Verificação visual: telas desktop e mobile, avanço/pulo/reabertura de cenas, retorno ao NPC, quiz normal, banner do confronto, recuperação, encerramento e persistência após recarregar. A validação de API pode usar respostas simuladas; autenticação Google/MySQL reais exigem os serviços e credenciais do ambiente.

## Arquivos

- Novos: `src/data/story.js`, `src/models/StoryModel.js`, `src/views/components/Story/StoryDialog.jsx` e `Story.css`.
- Integração: `src/App.jsx`, `src/controllers/GameController.jsx`, `src/models/GameModel.js` (somente o campo opcional de cenas vistas), `WorldSelect.jsx`, `PlatformGame.jsx`, `Quiz.jsx` e `Results/Defeat.jsx`.
- Verificação: `tests/story.test.js`, comando `test:story` em `package.json` e este documento.

Não houve alterações no backend, esquema de banco, gerador matemático, controlador de quiz, dados dos mundos, timer ou motor de plataforma.
