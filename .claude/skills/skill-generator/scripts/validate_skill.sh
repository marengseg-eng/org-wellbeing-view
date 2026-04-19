#!/usr/bin/env bash
# Valida um pacote de skill: verifica estrutura, frontmatter e nomes de ferramentas.

set -euo pipefail

SKILL_DIR="${1:?Uso: validate_skill.sh <caminho-do-skill>}"
ERRORS=0

VALID_TOOLS="Read Write Edit Glob Grep Bash Agent WebFetch WebSearch TodoWrite NotebookEdit ExitPlanMode Monitor PushNotification AskUserQuestion"

check() {
  local file="$SKILL_DIR/$1"
  if [[ ! -f "$file" ]]; then
    echo "ERRO: arquivo ausente — $1"
    ((ERRORS++))
  else
    echo "OK: $1"
  fi
}

check "SKILL.md"
check "examples.md"
check "playbook.md"

SKILL_MD="$SKILL_DIR/SKILL.md"
if [[ -f "$SKILL_MD" ]]; then
  for field in name description tools trigger; do
    if ! grep -q "^${field}:" "$SKILL_MD"; then
      echo "ERRO: frontmatter sem campo '${field}' em SKILL.md"
      ((ERRORS++))
    fi
  done

  while IFS= read -r line; do
    tool=$(echo "$line" | sed 's/^[[:space:]]*-[[:space:]]*//')
    if [[ -n "$tool" ]] && ! echo "$VALID_TOOLS" | grep -qw "$tool"; then
      echo "ERRO: ferramenta inválida '$tool' em SKILL.md"
      ((ERRORS++))
    fi
  done < <(awk '/^tools:/,/^[^ ]/' "$SKILL_MD" | grep '^\s*-')

  if awk '/^```/,/^```/' "$SKILL_MD" | grep -vE '^```' | grep -vqE '\.\.\.|etc\.' && \
     grep -E '\.\.\.|etc\.' "$SKILL_MD" | grep -qvE '^\s*(#|```)'; then
    echo "AVISO: SKILL.md contém '...' ou 'etc.' fora de blocos de código — remova linguagem vaga"
  fi
fi

if [[ "$ERRORS" -eq 0 ]]; then
  echo "Validação concluída: sem erros."
else
  echo "Validação concluída: $ERRORS erro(s) encontrado(s)."
  exit 1
fi
