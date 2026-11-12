import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { LOAD_REMOTE_MODULE } from '@quita/shared-angular-data-access';

export const appRoutes: Route[] = [
  {
    path: 'operations',
    // native import() of the remote registered at startup from the manifest
    loadChildren: () =>
      inject(LOAD_REMOTE_MODULE)<{ appRoutes: Route[] }>('operations', './routes').then(
        (m) => m.appRoutes, // the name exported by operations' app.routes.ts
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics-host/analytics-host').then((m) => m.AnalyticsHost),
  },
];
