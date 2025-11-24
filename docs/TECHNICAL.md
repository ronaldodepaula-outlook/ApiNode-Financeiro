# Documentação Técnica — ApiNode-Financeiro

Resumo técnico e orientações para desenvolvedores.

1. Visão geral
- **Propósito:** API REST para gerenciamento financeiro (empresas, usuários, papéis, licenças, grupos, subgrupos, movimentações e histórico).
- **Stack:** Node.js + Express + MongoDB (Mongoose).

2. Estrutura do repositório
- **Arquivos principais:**
  - `server.js` — ponto de entrada da API.
  - `app.js` — (se existir) fluxo express adicional.
  - `config/db.js` — conexão com MongoDB.
  - `controllers/` — lógica de negócio (usa `baseController` para operações CRUD genéricas).
  - `models/` — esquemas Mongoose.
  - `routes/` — definição das rotas e mapeamento para controllers.
  - `postman_collection.json` — coleção Postman gerada.
  - `docs/` — documentação técnica e operacional (este arquivo).

3. Variáveis de ambiente
- `.env` esperado (exemplos):
  - `MONGO_URI=mongodb://localhost:27017/dbname`
  - `PORT=3000`

4. Como executar localmente
- Instalar dependências:
  - `npm install`
- Executar servidor (PowerShell):
  - `node server.js`

5. Modelos (resumo dos `models/*.js`)
- `Empresa`:
  - `cpf_cnpj: String` (required, unique)
  - `nome: String` (required)
  - `tipo: String` (enum: `CPF` | `CNPJ`)

- `Usuario`:
  - `empresa_id: ObjectId` (ref Empresa, required)
  - `nome: String` (required)
  - `email: String` (required, unique)
  - `senha: String` (required)
  - `papel_id: ObjectId` (ref Papel, required)

- `Papel`:
  - `empresa_id: ObjectId` (ref Empresa)
  - `nome: String` (required)
  - `permissoes: Array` (lista de permissões)

- `Licenca` (`tb_licencas`):
  - `_id: String` (id custom)
  - `empresa_id: String` (required)
  - `plano, data_inicio, data_fim, status` (enum: `ATIVA`, `INATIVA`, `EXPIRADA`)
  - `limite_usuarios`, `limite_movimentacoes`

- `Grupo` / `Subgrupo` / `Movimentacao` / `HistoricoMovimentacao` — veja os arquivos em `models/` para detalhes de campos e enums.

6. Rotas e comportamento (padrão)
- Cada recurso principal tem o conjunto CRUD:
  - `POST /api/<recurso>` — cria (201 ou 400)
  - `GET /api/<recurso>` — lista (suporta `limit` / `skip` via query)
  - `GET /api/<recurso>/:id` — obtém por id (404 quando não existe)
  - `PUT /api/<recurso>/:id` — atualiza (404 quando não existe)
  - `DELETE /api/<recurso>/:id` — remove (404 quando não existe)
- Observações específicas:
  - `usuario` GETs populam `empresa_id` e `papel_id`.
  - `movimentacao.create` registra objeto e pode opcionalmente gravar histórico.

7. `baseController` (padrão)
- A maioria dos controllers usa `baseController` para evitar repetir CRUD. Para recursos com regras customizadas (ex: `movimentacaoController.create`), o controller substitui o `create` padrão.

8. Regras de validação chave
- Campos únicos: `Empresa.cpf_cnpj`, `Usuario.email`, `MasterAdmin.email`.
- Enums: `Empresa.tipo`, `Movimentacao.tipo`, `Licenca.status`, `HistoricoMovimentacao.acao`.

9. Boas práticas / dicas de desenvolvimento
- Migrations: usar ferramentas como `migrate-mongo` ou scripts para seed se precisar popular dados iniciais.
- Validação: adicionar validação adicional via `express-validator` nos controllers para melhorar mensagens de erro.
- Segurança: nunca salvar senha em texto plano — integrar `bcrypt` antes de persistir (`pre` save no model ou no controller). O código atual assume `senha` como campo, ajustar antes de produção.

10. Testes
- Não há testes unitários no repositório — recomendo adicionar `jest` + `supertest` para testes de rota e controllers.

11. Extensão: gerando OpenAPI/Swagger
- Podemos gerar um `openapi.json` / Swagger a partir dos controllers ou escrever manualmente. Isso facilita documentação interativa.

12. Referências rápidas
- Importar Postman: `postman_collection.json` na raiz.
- Principais arquivos para alterações:
  - Modelos: `models/*.js`
  - Lógica: `controllers/*.js`
  - Rotas: `routes/*.js`

---
Para dúvidas específicas (ex.: adicionar autenticação JWT, criptografia de senha, ou gerar o OpenAPI), posso gerar exemplos e patches.
