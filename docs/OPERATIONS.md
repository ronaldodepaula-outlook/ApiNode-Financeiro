# Documentação Operacional — ApiNode-Financeiro

Guia de operações, runbook e fluxos operacionais para administradores e operadores.

1. Sumário operacional
- **Objetivo:** descrever como executar, monitorar, manter e recuperar a aplicação em produção.

2. Pré-requisitos de ambiente
- Node.js instalado (versão compatível com `package.json`).
- MongoDB acessível (URI em `MONGO_URI`).

3. Comandos básicos (PowerShell)
- Instalar dependências:
  - `npm install`
- Rodar em produção (exemplo simples):
  - `node server.js`
- Recomendações de processo: executar via `pm2` (recomendado para produção):
  - `npm install -g pm2`
  - `pm2 start server.js --name ApiNode-Financeiro`

4. Deploy (passos gerais)
- 1) Puxar código no servidor.
- 2) `npm ci` (instala dependências conforme `package-lock.json`).
- 3) Atualizar variáveis de ambiente (`MONGO_URI`, `PORT`, segredos).
- 4) Reiniciar processo (ex.: `pm2 restart ApiNode-Financeiro`).

5. Backup e restauração MongoDB
- Backup (dump):
  - `mongodump --uri "%MONGO_URI%" --archive=backup-$(Get-Date -Format yyyyMMddHHmmss).gz --gzip`
- Restauração (restore):
  - `mongorestore --uri "%MONGO_URI%" --archive=backup.gz --gzip`

6. Monitoramento e logs
- Logs: iniciar `node server.js` via `pm2` para capturar logs e reinício automático.
- Monitoramento: usar `PM2 monit`, `Grafana` + `Prometheus` para métricas, ou serviços como Datadog/Loggly para logs agregados.

7. Healthcheck
- Implementar rota `/health` (recomendado) que verifica conexão com MongoDB e retorna 200.

8. Runbook — problemas comuns
- A API não inicia (exit code != 0):
  - Verificar `MONGO_URI` e conectividade (tentar `mongo` manualmente).
  - Ver logs: `pm2 logs ApiNode-Financeiro` ou revisar saída do `node server.js`.

- Erro de porta em uso:
  - Verificar processos que escutam a porta `3000` e finalizar.

- Erro de validação / 400 nas rotas:
  - Rever payload enviado (ver `postman_collection.json` para exemplos) e checar constraints de modelo.

9. Fluxos operacionais (descrição passo-a-passo)
- Onboarding de cliente / empresa:
  1) Criar `Empresa` (`POST /api/empresas`).
  2) Criar `Licenca` para a empresa (`POST /api/licencas`) com `_id` gerado e limites.
  3) Criar `Papel` base (`POST /api/papeis`) com permissões.
  4) Criar `Usuario` administrador (`POST /api/usuarios`) referenciando `empresa_id` e `papel_id`.

- Ciclo de vida de licença:
  - `ATIVA` → expira em `data_fim` → migrar para `EXPIRADA` ou `INATIVA` conforme regra de negócio.
  - Operadores devem verificar `data_fim` e atualizar `status` via `PUT /api/licencas/:id` quando necessário.

- Registro de movimentação (operações financeiras):
  1) Operador cria `Movimentacao` (`POST /api/movimentacoes`).
  2) API persiste movimentação e opcionalmente registra evento em `HistoricoMovimentacao`.
  3) Para auditoria, consultar `GET /api/historico`.

10. Segurança operacional
- Rotacionar segredos (variáveis de ambiente) periodicamente.
- Proteger backups (armazenamento criptografado e acesso restrito).

11. Escopo de manutenção programada
- Testar backup e restore trimestralmente.
- Aplicar atualizações de dependências em ambiente de staging antes de produção.

12. Contatos e escalonamento
- Equipe de desenvolvimento / suporte: listar responsáveis (preencher conforme organização).

---
Se quiser, posso:
- Gerar rota `/health` e integrar `pm2` com comandos de exemplo.
- Criar scripts de backup automatizados (PowerShell) e tarefas agendadas.
