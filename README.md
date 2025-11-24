
# ApiNode-Financeiro

Coleção/API REST para gerenciamento financeiro multi-tenant (empresas, usuários, papeis, licenças, grupos, subgrupos, movimentações e histórico). Este `README` foi preparado para publicação no GitHub e descreve em detalhe as regras de negócio, comportamento dos endpoints e instruções para desenvolvedores e operadores.

**Importante**: a coleção Postman foi gerada em `postman_collection.json` e pode ser importada diretamente no Postman.

**Conteúdo deste README**
- **Visão geral** — propósito e stack.
- **Como executar** — passos para rodar localmente e em produção.
- **Regras de negócio por recurso** — campos, validações, enums e comportamento esperado.
- **Comportamento dos endpoints** — códigos HTTP, paginação, preenchimento (populate) e erros.
- **Operações sensíveis** — licenças, limites e histórico de auditoria.
- **Boas práticas e próximos passos** — segurança, testes e OpenAPI.

**Visão geral e stack**
- Node.js + Express
- MongoDB via Mongoose
- Estrutura: `routes/` (rotas), `controllers/` (lógica), `models/` (esquemas), `config/db.js` (conexão)

Como executar localmente
- Instalar dependências:
```powershell
npm install
```
- Definir variáveis em `.env`:
  - `MONGO_URI` ex.: `mongodb://localhost:27017/financeiro`
  - `PORT` ex.: `3000`
- Executar:
```powershell
node server.js
```
- Recomendações para produção: executar via `pm2` ou outro process manager.

Importar coleção Postman
- Importar `postman_collection.json` no Postman.
- Definir variável de ambiente `baseUrl` como `http://localhost:3000/api` (ou URL do ambiente).

Regras de negócio por recurso
--------------------------------
Nota: os seguintes campos/validações estão implementados nos modelos Mongoose; os controllers aplicam comportamento adicional descrito abaixo.

- Empresa (`/api/empresas`)
  - Campos chave: `cpf_cnpj` (string, requerido, único, indexed), `nome` (required), `tipo` (enum: `CPF` | `CNPJ`).
  - Regras: `cpf_cnpj` deve ser único; criação falha com HTTP 400 se inválido/duplicado.
  - Uso: representa cliente/entidade; muitas entidades (Papel, Grupo, Subgrupo, Usuario) referenciam `empresa_id`.

- Usuario (`/api/usuarios`)
  - Campos chave: `empresa_id` (ObjectId, required), `nome` (required), `email` (required, único), `senha` (required), `papel_id` (ObjectId, required).
  - Regras: `email` único; o controller preenche (`populate`) `empresa_id` e `papel_id` nas rotas GET.
  - Observação crítica: atualmente a senha está em texto no model; antes de produção, integrar `bcrypt` para hash e não retornar `senha` nas respostas.

- MasterAdmin (`/api/master-admin`)
  - Campos chave: `nome`, `email` (único), `senha`.
  - Regras: similar a `Usuario` mas sem `empresa_id`.

- Papel (`/api/papeis`)
  - Campos chave: `empresa_id` (required), `nome` (required), `permissoes` (array).
  - Regra principal: `permissoes` é uma lista de strings representando ações autorizadas (ex.: `LANCAR_MOVIMENTACAO`). As permissões são apenas informacionais a menos que middleware de autorização seja adicionado.

- Licença (`/api/licencas`)
  - Campos chave: `_id` (string, custom), `empresa_id` (string, required), `plano`, `data_inicio`, `data_fim`, `status` (enum: `ATIVA` | `INATIVA` | `EXPIRADA`), `limite_usuarios`, `limite_movimentacoes`.
  - Regras operacionais:
    - `_id` é usado como identificador da licença (ex.: `licenca-123`).
    - `status` indica operação: `ATIVA` normalmente significa acesso permitido; `EXPIRADA`/`INATIVA` bloqueiam operações dependendo da regra de negócio de aplicação cliente.
    - Há índice por `empresa_id` e `status` para consultas rápidas.

- Grupo (`/api/grupos`) e Subgrupo (`/api/subgrupos`)
  - Campos chave: ambos referenciam `empresa_id`. `Subgrupo` também referencia `grupo_id`.
  - Regras: `nome` requerido; `subgrupo` exige `grupo_id` válido.

- Movimentação (`/api/movimentacoes`)
  - Campos chave: `empresa_id` (required), `tipo` (enum: `Receita` | `Despesa`, required), `valor` (Number, required), `descricao`, `grupo_id`, `subgrupo_id`, `usuario_id` (required)
  - Regras de negócio importantes:
    - `tipo` deve ser `Receita` ou `Despesa` — use exatamente estes valores para consistência com o model.
    - `valor` é obrigatório; valores negativos não são proibidos pelo modelo, mas recomenda-se validar >= 0 se aplicável.
    - Ao criar, o `movimentacaoController.create` persiste a movimentação e **pode** (opcional) criar um registro em `HistoricoMovimentacao` para auditoria. Atualmente o trecho comenta a opção; se desejado, habilite gravação de histórico no controller.

- Histórico de Movimentação (`/api/historico`)
  - Campos: `movimentacao_id` (ObjectId, required), `usuario_id` (ObjectId, required), `acao` (enum: `CRIAR` | `EDITAR` | `EXCLUIR`), `detalhe`.
  - Regras: registrar eventos para auditoria; utilizar sempre `acao` padronizada para facilitar relatórios.

Comportamento dos endpoints e padrões HTTP
-----------------------------------------
- CRUD padrão para todos os recursos:
  - `POST /api/<recurso>` → cria. Retorna `201 Created` com o documento criado ou `400 Bad Request` com `{ error: <mensagem> }` em validações.
  - `GET /api/<recurso>` → lista. Suporta, normalmente, query params `limit` e `skip` (paginação simples). Retorna `200` com array.
  - `GET /api/<recurso>/:id` → busca por id. Retorna `200` com o documento ou `404 Not Found` se não existir.
  - `PUT /api/<recurso>/:id` → atualiza. Retorna o documento atualizado (ou no mínimo `200`) ou `404` se não existir.
  - `DELETE /api/<recurso>/:id` → remove. Retorna `200`/`204` ou `404` se não existir.

- Erros comuns e formato de resposta:
  - Validações do Mongoose retornam `400` com `{ error: <mensagem> }`.
  - Erros de duplicidade (unique) retornam `400` com mensagem indicando o campo duplicado.

- População de referências (populate):
  - `Usuario` GETs populam `empresa_id` e `papel_id` por padrão (ver controller).
  - `Movimentacao` GETs populam `grupo_id`, `subgrupo_id` e `usuario_id`.

Regras e comportamento operacional (fluxos)
-----------------------------------------
- Onboarding de empresa (fluxo recomendado):
  1) `POST /api/empresas` — criar empresa.
  2) `POST /api/licencas` — criar licença associada e definir limites.
  3) `POST /api/papeis` — criar papéis base com permissões.
  4) `POST /api/usuarios` — criar usuários vinculados à empresa.

- Ciclo de vida de licença:
  - Monitorar `data_fim` e atualizar `status` para `EXPIRADA` quando aplicável.
  - Aplicações integradas devem validar limites (`limite_usuarios`, `limite_movimentacoes`) antes de permitir criação de novos usuários/movimentações.

- Auditoria de movimentações:
  - Sempre que uma movimentação é criada/atualizada/excluída, registre uma entrada em `HistoricoMovimentacao` contendo `acao` e `detalhe` com informações que permitam auditoria.

Boas práticas de segurança e produção
------------------------------------
- Não salvar senhas em texto plano: aplicar `bcrypt` com salt e nunca retornar o campo `senha` nas respostas.
- Usar HTTPS em produção e armazenar `MONGO_URI` e segredos em variáveis de ambiente gerenciadas por cofre/secrets manager.
- Implementar autenticação (JWT, OAuth) e middleware de autorização baseado em `papel.permissoes`.

Sugestões para melhoria/integração
---------------------------------
- Gerar OpenAPI/Swagger a partir das rotas (ou escrever `openapi.yaml`) para documentação interativa.
- Implementar testes automatizados com `jest` + `supertest` cobrindo controllers principais.
- Adicionar healthcheck (`GET /health`) que valida conexão com MongoDB e retorna `200` quando OK.

Contribuição
------------
- Fork → branch de feature → PR com descrição clara e testes quando aplicável.

Licença
-------
- Colocar informação de licença se o repositório for público (ex.: MIT). Se desejar, eu adiciono `LICENSE`.

Arquivo de referência
- Coleção Postman: `postman_collection.json` (importar no Postman para exemplos de payloads e rotas).

Próximos passos que posso executar para você
- Gerar `openapi.json` / Swagger UI e adicionar rota `/docs`.
- Implementar JWT + middleware de autorização e atualizar a coleção Postman com tokens.
- Converter rotas vazias (`categoria`, `subcategoria`, `lancamento`) em placeholders com modelo/rotas sugeridas.

---
Se quiser, eu aplico agora uma das opções acima (escolha: OpenAPI, autenticação JWT, healthcheck, ou criar placeholders para rotas vazias). Obrigado — posso continuar assim que você indicar a opção desejada.

