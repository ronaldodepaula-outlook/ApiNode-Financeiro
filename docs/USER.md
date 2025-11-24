# User / Operator Guide — ApiNode-Financeiro

Este documento é voltado para operadores/usuários funcionais que irão usar a API via Postman ou integrar sistemas.

1. Objetivo
- Descrever os principais fluxos operacionais, onboarding, gerenciamento de usuários, licenças e auditoria.

2. Fluxo de Onboarding (empresa)
1) Criar Empresa + Usuário Administrador (rota pública):
   - `POST /api/auth/register` com payload:
```json
{
  "empresa": { "cpf_cnpj": "61559628391", "nome": "Minha Residência", "tipo": "CNPJ" },
  "user": { "nome": "Ronaldo de Paula", "email": "ronaldodepaula@yahoo.com.br", "senha": "123" }
}
```
   - Resultado: cria `Empresa`, cria `Papel` "Admin" caso não exista, cria `Usuario` vinculado e retorna `{ token, user }`.

2) Login (rota pública):
   - `POST /api/auth/login` com `{ email, senha }` retorna `{ token, user }`.

3) Usando o token:
   - Inclua no header `Authorization: Bearer <token>` para acessar rotas protegidas.

3. Principais operações
- Gerenciar Empresas: CRUD em `/api/empresas`.
- Gerenciar Usuários: CRUD em `/api/usuarios` (usuários têm `empresa_id` e `papel_id`).
- Gerenciar Papeis: CRUD em `/api/papeis` (papéis são globais ao sistema; acesso recomendado apenas para administradores).
- Gerenciar Licenças: CRUD em `/api/licencas` (controle de status e limites).
- Movimentações: CRUD em `/api/movimentacoes` (cada movimentação está vinculada à `empresa_id` e `usuario_id`).
- Histórico: `/api/historico` para auditoria de mudanças em movimentações.

4. Auditoria e logs
- Para auditoria de movimentações, utilize `HistoricoMovimentacao` (rota `/api/historico`).

5. Resolução de problemas comuns
- 401 Unauthorized: verifique se o token foi enviado e se não foi invalidado (logout invalida token).
- 400 Bad Request: geralmente erros de validação (campos obrigatórios, formato de CPF/CNPJ).
- 404 Not Found: recurso não existe.

6. Testes via Postman
- Importe `postman_collection_tests.json` e execute a pasta `Auth` primeiro (Register → Login) para obter `{{token}}`.
- Execute a pasta `Tests` para rodar casos automatizados (o collection contém scripts de teste que setam/limpam `{{token}}`).

7. Contatos e suporte
- Para questões operacionais, reporte issues no GitHub com o label `ops` e inclua logs e payloads de exemplo.
