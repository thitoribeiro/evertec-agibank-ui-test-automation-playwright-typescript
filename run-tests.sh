#!/usr/bin/env bash
# run-tests.sh — build, run and report
#
# Usage:
#   ./run-tests.sh           → Docker CI (headless, videos gravados para revisão)
#   ./run-tests.sh --headed  → Local headed (browsers visíveis na máquina)
#   ./run-tests.sh --report  → Só abre o último relatório HTML

set -euo pipefail

MODE="docker"

for arg in "$@"; do
  case $arg in
    --headed) MODE="headed" ;;
    --report) MODE="report" ;;
  esac
done

open_report() {
  echo ""
  echo "[✓] Abrindo relatório HTML..."
  npx playwright show-report playwright-report
}

if [ "$MODE" = "report" ]; then
  open_report
  exit 0
fi

echo ""
echo "================================================="
echo "  Blog do Agi — Playwright Tests"
echo "  Modo: $MODE"
echo "================================================="
echo ""

if [ "$MODE" = "headed" ]; then
  echo "[1/2] Executando testes headed localmente (browsers visíveis)..."
  HEADLESS=false npx playwright test --headed
  EXIT_CODE=$?
else
  echo "[1/3] Build da imagem Docker..."
  docker compose build test-runner

  echo ""
  echo "[2/3] Executando testes no Docker (headless + vídeo gravado)..."
  docker compose run --rm test-runner
  EXIT_CODE=$?
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✓ Todos os testes passaram."
else
  echo "✗ Alguns testes falharam (exit $EXIT_CODE). Verifique o relatório."
fi

open_report
exit $EXIT_CODE
