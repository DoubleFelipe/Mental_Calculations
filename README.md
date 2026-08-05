# Mental Calculations

Jogo educacional de plataforma e quiz para praticar equações do segundo grau. Pode ser jogado em modo convidado (progresso local) ou com conta Google (progresso sincronizado com MySQL).

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
