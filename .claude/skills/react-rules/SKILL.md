---
name: react-rules
description: Convenções de React do quita-backoffice-web (Web Component do Analytics, hooks, TanStack Query, estado, acessibilidade, testes). Use ao escrever, revisar ou discutir código React de apps/analytics ou de libs/analytics/*.
---

# Regras da stack: React (Analytics)

Valem para `apps/analytics` e `libs/analytics/*`. A origem é o LLD do backoffice (`../quita-docs/docs/lld/backoffice.md`, seções 4 e 8); quando divergir, vale o LLD.

## Fronteira com o shell

- O app é o custom element `<quita-analytics>`: monta a árvore React no `connectedCallback`, dentro do Shadow DOM, e desmonta no `disconnectedCallback`.
- Entram por propriedade `getAccessToken`, `filters` e `user`; saem por `CustomEvent` (`bubbles` e `composed`) `quita-filters-change` e `quita-navigate`.
- A árvore lê as propriedades com `useSyncExternalStore`, sem cópia em estado local.
- O Analytics **não** guarda token, não mexe no histórico do navegador e não desenha menu nem barra. Os filtros aplicados pertencem à URL do shell.
- Estilos dentro do Shadow DOM, com os tokens compartilhados (CSS custom properties). Portal (`createPortal`) aponta para um nó dentro do shadow root, nunca para o `document.body`.
- Nada de `libs/shared/angular/*` nem de `libs/operations/*` é importado aqui (o lint barra pelas tags `framework:` e `scope:`).

## Componentes e estado

- Componentes de função, com TypeScript estrito. Estados de tela como união discriminada.
- Estado perto de quem usa; elevar só quando dois componentes precisam do mesmo valor.
- **Derivar no render** em vez de sincronizar com efeito. `useEffect` é para falar com o mundo de fora (assinatura, DOM, timer), sempre com limpeza.
- `useReducer` quando há várias transições com regra; o reducer é função pura e não muta o estado.
- Context é transporte, não gerência de estado: contextos pequenos e separados (usuário, tema), com valor estável.
- `ref` para DOM e valor que não vai para a tela; nunca ler ou escrever `ref.current` durante o render.
- `key` estável por identidade; `key` por índice só em lista que não muda.
- StrictMode ligado; as regras dos hooks e do React Compiler ficam no lint.

## Dados

- Toda leitura da API passa por TanStack Query, num hook por consulta (`useRecoverySummary(filters)`).
- A chave da consulta contém **tudo** de que o `queryFn` depende, numa fábrica de chaves; `staleTime` de 60 s no painel.
- `queryFn` repassa o `signal` para o `fetch`; o token vem de `getAccessToken()` a cada chamada.
- Carregando e erro por card: `useSuspenseQuery` + `<Suspense>` + error boundary por card. Um card com erro não derruba os outros.
- Dinheiro chega como string e é só formatado. Nenhuma conta com dinheiro.
- O filtro por Operador é conveniência de tela; quem restringe os números é a API.

## Desempenho

- `memo`, `useMemo` e `useCallback` só com uma medição do Profiler que justifique; com o React Compiler ligado, a memoização manual é exceção documentada.
- Código pesado (gráficos) com `lazy` + `Suspense`.
- Medida de layout em `useLayoutEffect`; observadores (`ResizeObserver`) desconectados na limpeza.

## Acessibilidade

- Cada gráfico tem título, descrição e uma alternativa em texto (tabela). Cor nunca é o único canal.
- Ids com `useId`. Filtros e ações por teclado, com foco visível.

## Testes

- Vitest + Testing Library + MSW, selecionando por papel e texto. Reducers e conversões como funções puras; hooks com `renderHook` e relógio falso.
- Sem espera real e sem testar detalhe de implementação (estado interno, nome de classe CSS).

## Legado: reconhecer, não escrever

Componentes de classe (exceto o error boundary), HOCs e render props como padrão principal, `forwardRef` (no React 19, `ref` é prop), `useEffect` + `fetch` + três `useState` para buscar dados.
