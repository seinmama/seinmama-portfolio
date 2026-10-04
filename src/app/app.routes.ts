import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/room-landing').then((m) => m.RoomLanding),
  },
  {
    path: 'studio',
    loadComponent: () => import('./features/studio/studio').then((m) => m.Studio),
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
