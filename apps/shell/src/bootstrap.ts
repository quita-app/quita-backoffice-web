import { bootstrapApplication } from '@angular/platform-browser';
import {
  APP_CONFIG,
  AppConfig,
  LOAD_REMOTE_MODULE,
  LoadRemoteModule,
  REMOTES_MANIFEST,
  RemotesManifest,
} from '@quita/shared-angular-data-access';
import { appConfig } from './app/app.config';
import { App } from './app/app';

export function bootstrap(
  manifest: RemotesManifest,
  config: AppConfig,
  loadRemoteModule: LoadRemoteModule,
) {
  return bootstrapApplication(App, {
    ...appConfig,
    providers: [
      ...appConfig.providers,
      // the values read in main.ts become injectable anywhere: inject(APP_CONFIG)
      { provide: REMOTES_MANIFEST, useValue: manifest },
      { provide: APP_CONFIG, useValue: config },
      { provide: LOAD_REMOTE_MODULE, useValue: loadRemoteModule },
    ],
  });
}
