# Evertec Agibank — Automação de Testes UI

Projeto de automação de testes de interface para o [Blog do Agi](https://blog.agibank.com.br), desenvolvido com **Playwright + TypeScript**. A arquitetura segue o padrão **Page Object Model (POM)** com seletores externalizados em JSON, garantindo manutenibilidade e separação de responsabilidades.

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Runtime JavaScript |
| [TypeScript](https://www.typescriptlang.org/) | 5.4+ | Tipagem estática |
| [Playwright](https://playwright.dev/) | 1.42+ | Framework de testes E2E |
| [Docker](https://www.docker.com/) | 20+ | Execução em container isolado |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |
| [ESLint](https://eslint.org/) | 8+ | Análise estática de código |
| [Prettier](https://prettier.io/) | 3+ | Formatação de código |

---

## Cenários de Teste

### Homepage (3 cenários)
| # | Cenário |
|---|---|
| 1 | Deve carregar com título e logo visíveis |
| 2 | Deve exibir artigos no carrossel hero |
| 3 | Deve exibir cards de artigos na seção Últimas do Blog |

### Busca de Artigos (6 cenários)
| # | Cenário |
|---|---|
| 4 | Deve retornar resultados para termo válido |
| 5 | Deve exibir mensagem de nenhum resultado para termo inválido |
| 6 | Deve aceitar caracteres especiais sem quebrar a página |
| 7 | Deve retornar resultados para a categoria: INSS |
| 8 | Deve retornar resultados para a categoria: Pix |
| 9 | Deve retornar resultados para a categoria: Cartão |

### Leitura de Artigo (5 cenários)
| # | Cenário |
|---|---|
| 10 | Deve abrir o artigo correto ao clicar no resultado |
| 11 | Deve exibir título, autor e data de publicação |
| 12 | Deve exibir breadcrumb com link Home |
| 13 | Deve ter URL com slug do artigo |
| 14 | Deve conter corpo de texto legível |

### Navegação por Menu (4 cenários)
| # | Cenário |
|---|---|
| 15 | Deve exibir submenu ao fazer hover em Produtos |
| 16 | Deve exibir Consignado e Pessoal ao hover em Empréstimos |
| 17 | Deve navegar para categoria e exibir artigos |
| 18 | Deve exibir submenu do O Agibank com Colunas, Notícias e Carreira |

### Paginação de Artigos (2 cenários)
| # | Cenário |
|---|---|
| 19 | Não deve exibir botão Anterior na página 1 |
| 20 | Deve exibir botão Anterior na página 2 e voltar à página 1 |

**Total: 20 cenários × 2 browsers (Chromium + Firefox) = 40 testes**

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão **18 ou superior**
- [Docker](https://www.docker.com/products/docker-desktop/) (para execução via container)
- Git

---

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/thitoribeiro/evertec-agibank-ui-test-automation-playwright-typescript.git
cd evertec-agibank-ui-test-automation-playwright-typescript

# 2. Instalar dependências
npm install

# 3. Instalar navegadores do Playwright
npx playwright install --with-deps chromium firefox
```

---

## Execução

O projeto disponibiliza um script unificado `run-tests.sh` e atalhos via `npm run`.

### Opção 1 — Local (navegadores visíveis na máquina)

```bash
# Headless — executa em segundo plano, abre relatório ao terminar
./run-tests.sh local

# Headed — navegadores visíveis na tela durante a execução
./run-tests.sh local --headed

# Apenas Chromium
./run-tests.sh local --project=chromium

# Apenas Firefox
./run-tests.sh local --project=firefox

# Via npm
npm run test:all         # Chromium + Firefox headless
npm run test:headed      # Chromium + Firefox headed (visível)
npm run test:chromium    # Só Chromium
npm run test:firefox     # Só Firefox
```

### Opção 2 — Docker (CI mode)

Executa os testes dentro de um container isolado, com vídeo gravado de todos os testes para revisão visual posterior. Não é necessário ter Node.js ou navegadores instalados na máquina.

```bash
# Build da imagem + execução dos testes + abertura do relatório
./run-tests.sh docker

# Via npm
npm run test:docker
```

O relatório HTML e os vídeos são exportados para as pastas locais `playwright-report/` e `test-results/` via volume Docker.

### Opção 3 — GitHub Actions (CI/CD)

O pipeline é disparado automaticamente em:
- `push` para `main`, `develop` ou qualquer branch `feature/**`
- `pull_request` para `main`
- Disparo manual via **Actions → Run workflow**

O workflow executa dois jobs em paralelo:

**Job `test`** — testes nativos em Chromium e Firefox:
1. Checkout do código
2. Setup Node.js 20 com cache npm
3. `npm ci` para instalar dependências
4. Instalação dos browsers Playwright
5. Execução dos testes
6. Upload do relatório HTML e vídeos como artefatos (30 dias)

**Job `docker`** — validação da imagem Docker (após `test`):
1. Build da imagem Docker
2. Execução dos testes no container
3. Upload do relatório Docker como artefato

Para disparar manualmente:
1. Acesse o repositório no GitHub
2. Clique em **Actions**
3. Selecione o workflow **Agi Blog — UI Tests**
4. Clique em **Run workflow**

---

## Relatório

Após qualquer execução, abra o relatório HTML interativo:

```bash
# Via script
./run-tests.sh report

# Via npm
npm run report

# Via playwright diretamente
npx playwright show-report
```

O relatório inclui:
- Status de cada teste (passou / falhou / flaky)
- Vídeos gravados de cada execução
- Screenshots de falhas
- Traces para depuração
- Tempo de execução por teste e por suite

---

## Estrutura do Projeto

```
.
├── .github/
│   └── workflows/
│       └── tests.yml           # Pipeline GitHub Actions
├── src/
│   ├── fixtures/
│   │   └── base-test.ts        # Extensão do Playwright com Page Objects injetados
│   ├── pages/
│   │   ├── base.page.ts        # Classe abstrata base para todos os POMs
│   │   ├── home.page.ts        # POM da Homepage
│   │   ├── search.page.ts      # POM da busca
│   │   ├── article.page.ts     # POM da leitura de artigo
│   │   ├── navigation.page.ts  # POM do menu de navegação
│   │   └── pagination.page.ts  # POM da paginação
│   ├── selectors/
│   │   ├── homepage.selectors.json
│   │   ├── search.selectors.json
│   │   ├── article.selectors.json
│   │   ├── navigation.selectors.json
│   │   └── pagination.selectors.json
│   ├── tests/
│   │   ├── homepage.spec.ts
│   │   ├── search.spec.ts
│   │   ├── article.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── pagination.spec.ts
│   └── utils/
│       ├── selector-loader.ts   # Carrega seletores do JSON em runtime
│       ├── wait-helpers.ts      # Helpers de espera customizados
│       └── logger.ts            # Logger estruturado
├── Dockerfile                   # Imagem Docker com Playwright
├── docker-compose.yml           # Orquestração do container de testes
├── playwright.config.ts         # Configuração global (browsers, timeouts, relatórios)
├── run-tests.sh                 # Script unificado de execução
├── tsconfig.json                # Configuração TypeScript
└── package.json
```

---

## Qualidade de Código

```bash
# Verificar lint
npm run lint

# Formatar código
npm run format
```

---

Desenvolvido por **Thito Ribeiro**
