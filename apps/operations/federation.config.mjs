import {
  fromPackageJson,
  mappingsFromWorkspace,
  withNativeFederation,
} from '@angular-architects/native-federation/config';

export default withNativeFederation({
  // o nome do remote: é a chave dele no federation.manifest.json do shell
  name: 'operations',

  // o que o remote oferece ao mundo: só as rotas (o shell decide onde montá-las)
  exposes: {
    './routes': './apps/operations/src/app/app.routes.ts',
  },

  // toda dependência do package.json é compartilhada: uma instância só (singleton),
  // e a versão precisa bater exatamente com a do shell (strictVersion)
  shared: fromPackageJson({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
    build: 'package',
  }).patch(['@angular/*'], { includeSecondaries: { keepAll: true } }),

  // as libs do monorepo (@quita/...) também são compartilhadas como singleton:
  // o token APP_CONFIG do shell e o do remote precisam ser O MESMO objeto (Parte 8)
  sharedMappings: mappingsFromWorkspace({ singleton: true }).filter(['@quita/*']).get(),

  // partes do RxJS que o Quita não usa: não vale baixar
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],

  features: {
    denseChunking: true,
    denseExternals: true,
    strictImports: false,
  },
});
