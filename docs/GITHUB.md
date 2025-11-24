# GitHub / Release Guide — ApiNode-Financeiro

Guia rápido com recomendações para publicar e manter o repositório no GitHub.

1. Branching e Releases
- Use `main` para produção e `develop` para integração (opcional).
- Feature branches: `feature/<descrição>`.
- Pull Request: adicione descrição, passos para testar e assignees/reviewers.

2. CI (recomendação)
- Adicione um workflow GitHub Actions que execute `npm ci` e `npm test` em PRs.
- Exemplo de arquivo: `.github/workflows/ci.yml` (não criado automaticamente) com Node.js matrix e etapas: install, test.

3. Versionamento
- Use SemVer para tags e releases (`vMAJOR.MINOR.PATCH`).

4. Changelog e migrações
- Mantenha `CHANGELOG.md` com mudanças significativas e instruções de migração.
- Para mudanças no schema (ex.: remoção de `Papel.empresa_id`) inclua uma seção de migração com scripts (ex.: `scripts/migrate/remove_papel_empresa.js`).

5. Segurança
- Armazene secrets (ex.: `MONGO_URI`, `JWT_SECRET`) no GitHub Secrets, não no repositório.

6. Templates úteis
- Issue template, PR template e CODEOWNERS ajudam na manutenção e revisão.

7. Publicação
- Para publicar releases: criar tag e usar a UI do GitHub Releases. Anexe artefatos relevantes (ex.: schema, dump de exemplo).

---
Se desejar, eu posso:
- Gerar o `ci.yml` e os templates de issue/PR automaticamente e abrir um patch.
