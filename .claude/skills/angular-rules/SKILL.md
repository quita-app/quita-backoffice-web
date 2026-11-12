---
name: angular-rules
description: Convenções de Angular do quita-backoffice-web (componentes, signals, RxJS, DI, rotas, HTTP, formulários, acessibilidade, testes). Use ao escrever, revisar ou discutir código Angular do shell, do remote Operações ou das libs angular/*.
---

# Regras da stack: Angular

Valem para `apps/shell`, `apps/operations` e `libs/angular/*`, `libs/operations/*`. A origem é o LLD do backoffice (`../quita-docs/docs/lld/backoffice.md`); quando divergir, vale o LLD. Use só APIs atuais; o que é legado aparece na última seção.

## Componentes e templates

- Standalone, zoneless, detecção `OnPush` (o padrão). Sem `NgModule`.
- Entradas e saídas com `input()`, `input.required()`, `output()` e `model()`; consultas com `viewChild()`/`contentChild()`.
- Controle de fluxo nativo: `@if`, `@for` (sempre com `track` por identidade estável, nunca `$index` em lista que muda), `@switch`, `@defer` para bloco pesado abaixo da dobra.
- Eventos e bindings do elemento hospedeiro no `host` do decorator.
- Componente de `ui` é apresentação: recebe e emite, não injeta `HttpClient`, serviço de API, store nem `Router`.
- Estado de tela como **união discriminada** (`idle | loading | ready | error`), com `@switch` no template; sem booleanos soltos que permitam combinação impossível.
- Texto vindo de usuário sempre por interpolação; `[innerHTML]` só com justificativa.

## Reatividade

- `signal` para estado, `computed` para derivado, `linkedSignal` para estado dependente que o usuário altera.
- `effect` só para efeito colateral com o mundo de fora (DOM, armazenamento, log). Nunca para copiar um signal em outro.
- `resource`/`httpResource`/`rxResource` para dado buscado a partir de parâmetros.
- **RxJS para tempo:** digitação, cancelamento, novas tentativas, SSE, polling. A ponte é `toSignal`/`toObservable`/`rxMethod`.
- Operador de achatamento escolhido de propósito: `switchMap` (leitura em que só o último importa), `exhaustMap` (envio de formulário), `concatMap` (fila), `mergeMap` (paralelo independente).
- `catchError` e `retry` **dentro** do Observable interno; retry só em leitura idempotente e em erro passageiro.
- Nenhum `subscribe()` sem dono: `toSignal`, `takeUntilDestroyed` ou o pipe `async`. Timer, ouvinte e worker têm limpeza.
- Estado compartilhado entre componentes num NgRx SignalStore por funcionalidade; estado de um componente só fica nele.

## Injeção de dependência

- `inject()` em campo; serviços com `providedIn: 'root'`, ou em `providers` da rota ou do componente quando o estado é por instância.
- Configuração por `InjectionToken` (`APP_CONFIG`, `REMOTES_MANIFEST`), sem import de arquivo de ambiente.
- Cada lib expõe uma função `provideX()`.

## Rotas

- Tudo lazy (`loadComponent`, `loadChildren`); remotes por `loadRemoteModule`.
- Guards funcionais; redirecionar devolvendo `UrlTree`/`RedirectCommand`, não `router.navigate` + `false`.
- Parâmetros da rota como `input` (`withComponentInputBinding`). Filtro que faz sentido compartilhar mora na URL.
- Guard é experiência; quem proíbe é a API.

## HTTP

- Chamadas em `libs/angular/data-access`, devolvendo `Observable` com os tipos de `libs/shared/api-types`. Componente não conhece URL.
- Interceptors funcionais na ordem do LLD: `requestId`, `auth`, `serverWaking`, `problemDetails`.
- Parâmetros com `HttpParams`, nunca concatenados na URL.
- Erro tratado pelo `code`; `Idempotency-Key` gerada uma vez por intenção nas criações.

## Formulários

- Reactive Forms tipados (`NonNullableFormBuilder`) para formulário dinâmico ou com validação cruzada; template-driven para formulário pequeno e fixo.
- Validador é função pura, testada sem `TestBed`.
- Campo próprio que participa de formulário implementa `ControlValueAccessor`; `writeValue` não chama `onChange`.
- Erro junto do campo, depois da interação, com `aria-describedby` e `aria-invalid`; erro da API cai no campo.
- Dinheiro e percentual trafegam como string decimal.

## Acessibilidade e desempenho

- Tudo operável por teclado, foco visível e gerenciado ao abrir e fechar; atalho de letra não dispara em campo de texto.
- Atualização ao vivo com `aria-live` ou `LiveAnnouncer`; animação respeita `prefers-reduced-motion`.
- Lista longa com rolagem virtual; trabalho pesado de CPU em Web Worker.
- Pipe puro; nada de função chamada no template para cálculo.

## Testes

- Vitest. Regra pura sem `TestBed`; fluxo de tempo com tempo virtual (marble ou relógio falso); interceptor com `HttpTestingController`.
- Tela com Testing Library + MSW, selecionando por papel e texto, como o usuário.
- Sem espera real (`setTimeout`), sem seletor por classe CSS.

## Legado: reconhecer, não escrever

`NgModule`, `@Input`/`@Output`/`EventEmitter`, `@HostListener`/`@HostBinding`, `*ngIf`/`*ngFor`, `ngClass`/`ngStyle`, guards e interceptors de classe, `Subscription` guardada + `ngOnDestroy`, `subject destroy$` + `takeUntil`, Zone.js e `ChangeDetectorRef.markForCheck`.
