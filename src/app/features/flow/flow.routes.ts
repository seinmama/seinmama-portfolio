import { Routes } from '@angular/router';

export const flowRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'intro',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro').then((m) => m.Intro),
  },
  {
    path: 'audience',
    loadComponent: () => import('./audience/audience').then((m) => m.Audience),
  },
  {
    path: 'skins',
    loadComponent: () => import('./skins/skins').then((m) => m.Skins),
  },
  {
    path: 'terminal',
    loadComponent: () => import('./terminal/terminal').then((m) => m.Terminal),
  },
];
