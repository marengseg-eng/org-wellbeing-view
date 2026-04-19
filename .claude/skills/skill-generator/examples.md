# Exemplos — skill-generator

## Exemplo 1 — Skill simples de linter

**Input do usuário:** "Crie um skill chamado `lint-check` que roda ESLint e reporta erros"

**Comportamento esperado:**
- Gera SKILL.md com frontmatter correto
- Usa ferramentas `Bash` e `Read`
- Playbook cobre como instalar ESLint se ausente

**Output (Seção A — SKILL.md):**
```yaml
---
name: lint-check
description: Roda ESLint no projeto e reporta erros com localização exata.
tools:
  - Bash
  - Read
trigger: >
  Use quando o usuário pedir para checar qualidade do código,
  rodar linter, ou antes de fazer commit.
---

# lint-check

## Passos

1. Verificar se ESLint está instalado: `npx eslint --version`
2. Rodar: `npx eslint . --format=compact`
3. Se houver erros, listar arquivo:linha:coluna — mensagem
4. Se nenhum erro, confirmar "Nenhum erro de lint encontrado"
```

---

## Exemplo 2 — Skill com script externo e variável de ambiente

**Input do usuário:** "Quero um skill `db-snapshot` que faz dump do banco Postgres usando uma URL de conexão de variável de ambiente"

**Comportamento esperado:**
- Gera SKILL.md com `settings.env`
- Gera `scripts/snapshot.sh` com lógica de dump
- playbook.md explica como definir `DATABASE_URL`

**Output (Seção A — SKILL.md, fragmento):**
```yaml
---
name: db-snapshot
description: Cria dump do banco Postgres a partir de DATABASE_URL.
tools:
  - Bash
  - Write
trigger: >
  Use quando precisar fazer backup do banco antes de migrations ou releases.
settings:
  env:
    DATABASE_URL: ""
---
```

**Output (Seção D — scripts/snapshot.sh):**
```bash
#!/usr/bin/env bash
# Gera dump do banco Postgres definido em DATABASE_URL para ./backups/

set -euo pipefail
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTDIR="./backups"
mkdir -p "$OUTDIR"
pg_dump "$DATABASE_URL" > "$OUTDIR/snapshot_$TIMESTAMP.sql"
echo "Dump salvo em $OUTDIR/snapshot_$TIMESTAMP.sql"
```

---

## Exemplo 3 — Caso de falha: ferramenta inválida

**Input do usuário:** "Crie um skill que usa a ferramenta `FileSystem` para ler arquivos"

**Comportamento esperado:**
- O skill-generator identifica que `FileSystem` não é uma ferramenta válida
- Recusa gerar o SKILL.md com esse nome
- Sugere a alternativa correta

**Output:**
```
Ferramenta inválida detectada: `FileSystem` não existe no Claude Code.

Ferramentas válidas para leitura de arquivos:
  - Read    → lê um arquivo por caminho absoluto
  - Glob    → encontra arquivos por padrão glob
  - Grep    → busca conteúdo em arquivos

Deseja que eu use `Read` e `Glob` no lugar de `FileSystem`?
```

O skill não é gerado até a entrada ser corrigida.

---

## Exemplo 4 — Caso de falha: nome de skill inválido

**Input do usuário:** "Crie um skill chamado `Meu Skill Incrível`"

**Comportamento esperado:**
- Identifica que o nome contém espaços e maiúsculas
- Propõe versão em kebab-case

**Output:**
```
O nome "Meu Skill Incrível" não está em kebab-case.

Sugestão: `meu-skill-incrivel`

Confirma esse nome ou prefere outro?
```
