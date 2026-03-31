#!/usr/bin/env bash
# run-tests.sh — Interface unificada para execução de testes
#
# Uso:
#   ./run-tests.sh local             → Executa localmente (headless por padrão)
#   ./run-tests.sh local --headed    → Executa localmente com interface visível
#   ./run-tests.sh docker            → Executa via Docker Compose (CI mode)
#   ./run-tests.sh report            → Abre o último relatório gerado
#   ./run-tests.sh --help            → Exibe ajuda

set -euo pipefail

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_help() {
  echo -e "${BLUE}Blog do Agi — Automação de Testes UI${NC}"
  echo ""
  echo "Uso: ./run-tests.sh [COMANDO] [OPÇÕES]"
  echo ""
  echo "Comandos:"
  echo "  local          Executa os testes no ambiente local."
  echo "  docker         Executa os testes dentro de um container Docker."
  echo "  report         Abre o relatório HTML do Playwright."
  echo ""
  echo "Opções para 'local':"
  echo "  --headed       Executa com o navegador visível (padrão é headless)."
  echo "  --project=X    Executa um projeto específico (ex: chromium, firefox)."
  echo ""
  echo "Exemplos:"
  echo "  ./run-tests.sh local --headed --project=chromium"
  echo "  ./run-tests.sh docker"
  echo ""
}

open_report() {
  echo -e "\n${BLUE}[✓] Abrindo relatório HTML...${NC}"
  npx playwright show-report playwright-report || echo -e "${YELLOW}Aviso: Não foi possível abrir o relatório automaticamente. Tente rodar 'npx playwright show-report'.${NC}"
}

# Se não houver argumentos, mostra ajuda
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

COMMAND=$1
shift # Remove o primeiro argumento da lista

case $COMMAND in
  local)
    echo -e "\n${BLUE}=================================================${NC}"
    echo -e "${BLUE}  Executando testes LOCALMENTE${NC}"
    echo -e "${BLUE}=================================================${NC}\n"
    
    # Verifica se node_modules existe, senão instala
    if [ ! -d "node_modules" ]; then
      echo -e "${YELLOW}[!] node_modules não encontrado. Instalando dependências...${NC}"
      npm install
    fi

    # Executa o comando do playwright com os argumentos restantes
    npx playwright test "$@"
    EXIT_CODE=$?
    ;;

  docker)
    echo -e "\n${BLUE}=================================================${NC}"
    echo -e "${BLUE}  Executando testes via DOCKER${NC}"
    echo -e "${BLUE}=================================================${NC}\n"
    
    echo -e "${GREEN}[1/2] Fazendo build da imagem...${NC}"
    docker compose build test-runner

    echo -e "\n${GREEN}[2/2] Iniciando testes no container...${NC}"
    docker compose run --rm test-runner
    EXIT_CODE=$?
    ;;

  report)
    open_report
    exit 0
    ;;

  --help|-h)
    show_help
    exit 0
    ;;

  *)
    echo -e "${RED}Erro: Comando '$COMMAND' desconhecido.${NC}"
    show_help
    exit 1
    ;;
esac

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✓ Todos os testes passaram com sucesso!${NC}"
else
  echo -e "${RED}✗ Alguns testes falharam (exit $EXIT_CODE). Verifique o relatório para detalhes.${NC}"
fi

# Pergunta se deseja abrir o relatório em caso de falha ou se for local
if [ "$COMMAND" = "local" ]; then
  open_report
fi

exit $EXIT_CODE
