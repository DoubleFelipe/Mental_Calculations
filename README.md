# Mental Calculations

Aventura educativa de plataforma em Numeria: **A Lenda dos Números Perdidos**. Léo restaura mecanismos matemáticos, enfrenta cinco chefes e recupera o Coração dos Cálculos. O quiz continua disponível como treino livre no diário. Pode ser jogado em modo convidado (progresso local) ou com conta Google (progresso sincronizado com MySQL).

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- MySQL 8 para autenticação, ranking, loja e sincronização

## Instalação

Instale as dependências do frontend e do backend:

```bash
npm install
cd backend
npm install
```

Crie `backend/.env` a partir de `backend/.env.example` e preencha, no mínimo, as credenciais do MySQL e segredos distintos para JWT e sessão.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=mental_calculations
JWT_SECRET=gere_um_segredo_longo
SESSION_SECRET=gere_outro_segredo_longo
FRONTEND_URL=http://localhost:5173
```

Para login Google, preencha também `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e configure a URL de retorno mostrada no arquivo de exemplo.

## Banco de dados e execução

Com o MySQL em execução, crie o banco configurado em `DB_NAME` e execute as migrations/seeds:

```bash
cd backend
npm run migrate
```

Esse comando cria as tabelas, incluindo tentativas de fase usadas para validar conclusões de jogo, e cadastra mundos, fases e itens da loja.

Em dois terminais, inicie a aplicação:

```bash
# terminal 1, na raiz
npm run dev

# terminal 2, em backend
npm run dev
```

Abra `http://localhost:5173`. A API responde em `http://localhost:3001/api/health` depois que a conexão com MySQL for estabelecida.

## Scripts de qualidade

```bash
npm run lint
npm run build
```

## Recursos disponíveis

- Mapa 2D com teclado e controles touch para telas com ponteiro coarse.
- Quiz cronometrado, feedback e quadro branco.
- Vidas, pausa e fluxo de fim de jogo.
- Mundos e fases desbloqueados por progresso.
- Perfil, configurações e loja simulada no modo convidado.
- Login Google, progresso, inventário e ranking sincronizados no modo online.

## Segurança e limites atuais

O servidor valida a fase desbloqueada, o total de questões, limites numéricos e uma tentativa iniciada pelo usuário antes de registrar o resultado. O crédito duplo é verificado e consumido na mesma transação do resultado.

As perguntas continuam sendo geradas no navegador. Para um ranking competitivo ou pagamentos reais, a próxima evolução deve mover a geração/correção das perguntas para o servidor e associá-las à tentativa registrada.


## Campanha de Numeria

A campanha reutiliza os quatro percursos originais, elevadores, física, inventário, skins, áudio e rotas secretas. O quinto reino adapta o percurso de arenito com ambientação geométrica. As cinco fases por mundo continuam com IDs estáveis; o novo mundo usa IDs 21–25. A geração antiga de equações continua em `src/services/mathGenerator.js`; a aventura e seu treino usam `adventureMath.js`.

Cada fase possui selos distribuídos no percurso. Um acerto libera a barreira, ativa pontes de energia e conduz ao próximo selo. Nos chefes, os selos alternam lados da arena; ondas anunciadas exigem saltos. Erros oferecem explicação e nova tentativa, além de entrar no caderno de revisão. A fase é registrada somente quando todos os selos foram restaurados. O treino não concede fragmentos, desbloqueios ou recompensas de campanha.

| Fragmento | Conquista |
| --- | --- |
| Seiva da Soma | Floresta, fase 3 |
| Equilíbrio da Diferença | Goblin da Confusão |
| Luz dos Produtos | Cavernas, fase 3 |
| Laço dos Fatores | Aranha dos Fatores |
| Harmonia das Partes | Escorpião Decimal |
| Chave da Incógnita | Mestre X |
| Essência das Formas | Reino Geométrico, fase 4 |

Zero Absoluto exige os sete fragmentos e seis selos: operações básicas, multiplicação, frações, álgebra, geometria e um problema combinado. A conclusão abre o epílogo e o título Guardião dos Números. O diário permite reenfrentar chefes sem apagar as conquistas.

### Salvamento e atualização

Saves antigos são ampliados para cinco mundos antes de renderizar as telas; estrelas, compras, créditos e posições são mantidos. Aprovações anteriores continuam válidas. Fragmentos são derivados das melhores estrelas das conquistas, sem contadores incrementais: repetir uma fase não duplica fragmentos. O término da história depende dos sete fragmentos e da vitória final.

Selos parciais, diálogos vistos, enigmas secretos e checkpoints são salvos localmente. As fases concluídas, estrelas e fragmentos correspondentes usam a sincronização existente da conta. Os selos parciais ainda não são sincronizados entre dispositivos. A API continua validando tentativas e resultados; as questões são geradas e corrigidas no cliente, como antes.

**Antes de usar a campanha online, execute `npm run migrate` em `backend`.** Os seeds atualizam nomes e quantidades de questões e acrescentam o quinto mundo sem apagar registros. A leitura de progresso acrescenta linhas ausentes para contas antigas e libera o novo mundo para quem já venceu a quarta região. Não execute a migração de uma implantação antiga enquanto houver tentativas em andamento.

### Verificação

- `npm test`: migração de saves, reprovação, campanha completa, desbloqueios, sete fragmentos sem duplicação, âncoras dos selos, alternativas e seis conteúdos do chefe final.
- `npm run lint` e `npm run build`.
- Verificações manuais e limites desta entrega em `docs/numeria-validation.md`.
