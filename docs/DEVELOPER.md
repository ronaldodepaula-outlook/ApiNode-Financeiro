# Developer Guide — ApiNode-Financeiro

Este documento descreve como configurar o ambiente de desenvolvimento, executar a aplicação, rodar testes, aplicar migrações e boas práticas para contribuir com o projeto.

1. Requisitos
- Node.js (>=16 LTS recomendado)
- npm
- MongoDB (pode usar Atlas ou local). Para testes a suíte usa `mongodb-memory-server`.

2. Instalação e setup
- Clone o repositório e instale dependências:
```powershell
git clone <repo-url>
cd ApiNode-Financeiro
npm install
```
- Variáveis de ambiente (arquivo `.env` na raiz):
  - `MONGO_URI` — string de conexão com MongoDB.
  - `JWT_SECRET` — segredo JWT para assinar tokens.
  - `PORT` — porta (opcional).
  - `PUBLIC_PATHS` — caminhos públicos separados por vírgula (ex.: `/api/auth`).

3. Executando a API localmente
- Para rodar em modo simples:
```powershell
node server.js
```
- O servidor exporta o `app` sem iniciar o listener quando requerido (útil para testes).

4. Estrutura do código
- `server.js` — inicialização do Express + montagem das rotas e middlewares.
- `config/db.js` — conexão com MongoDB (usa `MONGO_URI`).
- `models/` — modelos Mongoose.
- `controllers/` — lógica por recurso.
- `routes/` — definição das rotas.
- `middleware/` — autenticação e autorização.
- `scripts/migrate/` — scripts de migração para manipulação de dados no MongoDB.

5. Autenticação e autorização (resumo técnico)
- JWT (assinado com `JWT_SECRET`).
- Rota pública para criar conta + empresa: `POST /api/auth/register` (cria `Empresa` se necessário e atribui o `Papel` com `nome: 'Admin'`).
- `authMiddleware` valida token e popula `req.user` (usuário populado com `empresa_id` e `papel_id`).
- `authorize(permission)` verifica se o `user.papel_id.permissoes` contém a permissão requerida.
- Logout faz blacklist do token na coleção `Token` com TTL.

6. Migrações de dados
- Scripts de migração estão em `scripts/migrate/`. Exemplo executado: `remove_papel_empresa.js` (removeu `empresa_id` do `Papel`).
- Para rodar uma migração manualmente:
```powershell
# $env:MONGO_URI = 'sua-connection-string'
node .\scripts\migrate\remove_papel_empresa.js
```

7. Testes
- A suíte de testes usa `jest`, `supertest` e `mongodb-memory-server`.
- Rodar os testes:
```powershell
npm test
```
- Os testes são integrados (in-memory MongoDB) e cobrem fluxos de autenticação. Coloque novos testes em `tests/`.

8. Debug e logs
- O projeto utiliza `console.log` para mensagens simples. Em desenvolvimento, recomendo usar `DEBUG` ou integrar `winston`/`pino` para logs estruturados.

9. Boas práticas de contribuição
- Fork → feature branch (`feature/<descrição>`) → PR com descrição e testes quando aplicável.
- Mantenha a compatibilidade das rotas públicas (evite breaking changes sem versão nova).

10. Pontos importantes ao alterar auth/roles
- Se alterar `Papel`/`Usuario` ou regras de autorização, garanta migrações e cobertura de testes.

---
Se quiser, adiciono exemplos de workflows GitHub Actions para CI (testes + lint). Podemos também adicionar scripts npm para facilitar o desenvolvimento (start:dev, migrate, seed).
