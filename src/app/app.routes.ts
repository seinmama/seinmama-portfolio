import { Routes } from '@angular/router';

const loadStudio = () => import('./features/studio/studio').then((m) => m.Studio);

export const routes: Routes = [
  {
    // TODO(room-landing): the door landing replaces this; its "3D studio" tile links to /studio.
    path: '',
    pathMatch: 'full',
    loadComponent: loadStudio,
  },
  {
    path: 'studio',
    loadComponent: loadStudio,
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
