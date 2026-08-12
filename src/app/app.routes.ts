import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'flow',
  },
  {
    path: 'flow',
    loadChildren: () => import('./features/flow/flow.routes').then((m) => m.flowRoutes),
  },
  {
    path: 'site',
    loadComponent: () => import('./features/site/site-shell').then((m) => m.SiteShell),
    loadChildren: () => import('./features/site/site.routes').then((m) => m.siteRoutes),
  },
];
