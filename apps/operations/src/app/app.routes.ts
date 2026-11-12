import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./health-page/health-page').then((m) => m.HealthPage),
  },
];
