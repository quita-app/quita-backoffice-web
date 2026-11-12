# AGENTS.md: quita-backoffice-web

Backoffice do **Quita**, uma plataforma B2B de cobrança e renegociação de dívidas. É o sistema interno da Credora (Gestor, Operador, Admin da plataforma), construído como micro front-ends num monorepo Nx:

| App | O que é | Tecnologia |
| --- | --- | --- |
| `apps/shell` | Host: layout, login, sessão, menu, carga dos remotes | Angular |
| `apps/operations` | Remote: Fila, ficha, importação, Política, pagamentos, admin | Angular (Native Federation) |
| `apps/analytics` | Painel, exposto como o Web Component `<quita-analytics>` | React + Vite |
| `apps/shell-e2e` | Fluxos de ponta a ponta | Playwright |

## Onde está o contexto

Os repos do Quita ficam lado a lado na mesma pasta. A documentação é do `quita-docs` e **não é copiada para cá**.

**Consulte o grafo antes de ler um documento inteiro.** Rode `graphify query "<pergunta>"` na pasta acima deste repo (`..`, onde fica o `graphify-out/`) e leia só os arquivos e as linhas que ele apontar. Sem grafo, ou com o grafo desatualizado, use a tabela abaixo. Em conflito, o arquivo vence o grafo.

| Preciso de | Leia |
| --- | --- |
| Vocabulário do domínio | `../quita-docs/GLOSSARY.md` (importado pelo `CLAUDE.md`) |
| Estrutura, rotas, estado, comunicação entre shell e remotes | `../quita-docs/docs/lld/backoffice.md` |
| Contrato da API e códigos de erro | `../quita-docs/docs/lld/api.md`, seção 7; tipos em `libs/shared/api-types` |
| Identidade visual, tokens e componentes | `../quita-docs/design/DESIGN.md` |
| Textos de tela e mapa de erros → texto | `../quita-docs/design/ux-writing.md` |
| Telas aprovadas e estados | `../quita-docs/design/hi-fi/`, `../quita-docs/design/prompts/backoffice/` |
| A funcionalidade e a tarefa em andamento | `../quita-docs/docs/features/<NN>-<title>/` |

## Stack

Nx · Angular (standalone, zoneless, signals) · Native Federation · NgRx SignalStore · RxJS · Reactive Forms · React + TypeScript + Vite · TanStack Query · Tailwind · Vitest + Testing Library + MSW · Playwright.

Versões fixadas: <!-- preencher no walking skeleton: Nx, Angular, Native Federation, React, Vite -->

## Comandos

<!-- conferir no walking skeleton com o que o Nx gerou -->

| Para | Comando |
| --- | --- |
| Servir o shell com os remotes | `npx nx serve shell` (+ `npx nx serve operations`, `npx nx serve analytics`) |
| Testes de um projeto | `npx nx test <project>` |
| Lint (inclui as fronteiras entre libs) | `npx nx lint <project>` |
| Build de um app | `npx nx build <project>` |
| Só o que a branch afetou | `npx nx affected -t lint test build` |
| Grafo de projetos | `npx nx graph` |
| Ponta a ponta | `npx nx e2e shell-e2e` |
| Gerar os tipos da API | <!-- preencher: openapi-typescript a partir do openapi.json da API --> |

A API local precisa estar rodando (`../quita-backend-api`); o servidor de desenvolvimento faz o proxy de `/api/*`.

## Estrutura

```
apps/      shell · operations · analytics · shell-e2e
libs/
  shared/         api-types · design-tokens · util          (TypeScript puro, usado por todos)
    angular/      ui · data-access · session · realtime     (shell e Operações; singleton na federação)
  operations/     feature-queue · feature-imports · feature-policies · feature-payments · feature-admin · data-access
  analytics/      feature-dashboard · ui
```

**Onde entra código novo:** a primeira pasta de `libs/` é o domínio. Só um app usa? `libs/<app>/`. Dois ou mais? `libs/shared/` (em `shared/angular/` se for Angular). Apps são finos: entrada, configuração e composição. Projeto = caminho com hífens (`operations-feature-queue`); apelido = `@quita/<projeto>`.

**Fronteiras** (tags do Nx, verificadas no lint; o import precisa passar nas três):

| Tag | Pode depender de |
| --- | --- |
| `type:app` | `type:feature`, `type:ui`, `type:data-access`, `type:util` |
| `type:feature` | `type:ui`, `type:data-access`, `type:util` |
| `type:data-access`, `type:ui` | `type:util` |
| `type:util`, `type:e2e` | nada |
| `scope:shell` | `scope:shared` |
| `scope:operations` | `scope:operations`, `scope:shared` |
| `scope:analytics` | `scope:analytics`, `scope:shared` |
| `scope:shared` | `scope:shared` |
| `framework:angular` | `framework:angular`, `framework:none` |
| `framework:react` | `framework:react`, `framework:none` |
| `framework:none` | `framework:none` |

Todo projeto novo recebe as três tags (`type:*`, `scope:*`, `framework:*`). Uma lib Angular nunca é importada pelo React, e vice-versa.

## Convenções

- **Idioma:** código, nomes, comentários, commits e branches em inglês. Textos de tela em pt-BR, vindos do `ux-writing.md`.
- **O shell não tem tela de negócio.** Tudo do domínio fica num remote.
- **Fronteira com o Analytics:** só propriedades para dentro (`getAccessToken`, `filters`, `user`) e eventos para fora (`quita-filters-change`, `quita-navigate`). Nada de Angular nem de React atravessa.
- **Dinheiro:** chega como string e é só formatado (`Intl.NumberFormat`, BRL). **Nenhuma conta com dinheiro no front.**
- **Erros:** decidir pelo `code` da API, nunca pelo texto. O que não for tratado mostra mensagem genérica com o `X-Request-Id`.
- **Token de acesso só em memória**; nada em `localStorage` ou `sessionStorage`.
- **Tipos da API** vêm de `libs/shared/api-types` (gerados); as chamadas são escritas à mão em `data-access` (Angular) ou em hooks (React).
- **Arquivos gerados por CLI** (apps, libs, componentes) nascem pelos geradores do Nx, não à mão.
- **Commits** semânticos, em inglês, uma frase. Commit, push e PR só a pedido.
- **Branches:** `main` protegida + `feat/*`, `fix/*`, `chore/*`, `docs/*`, `test/*`.

As regras detalhadas estão nas skills `angular-rules` e `react-rules` (`.claude/skills/`).

## Antes de dar uma tarefa por pronta

1. `npx nx affected -t lint test build` verde.
2. Estados da tela conferidos com o hi-fi (carregando, vazio, erro e os específicos).
3. Uso por teclado e foco visível; erro e atualização ao vivo anunciados.
4. Nenhuma inscrição, timer ou ouvinte sem limpeza.
