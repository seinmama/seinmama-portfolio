import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ThemeService } from '../../core/theme.service';

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
    path: 'style',
    loadComponent: () => import('./style/style').then((m) => m.Style),
  },
  {
    path: 'skins',
    loadComponent: () => import('./skins/skins').then((m) => m.Skins),
  },
  {
    path: 'quiz',
    canActivate: [() => inject(ThemeService).audience() === 'friend' || inject(Router).createUrlTree(['/flow/loading'])],
    loadComponent: () => import('./quiz/quiz').then((m) => m.Quiz),
  },
  {
    path: 'loading',
    loadComponent: () => import('./loading/loading').then((m) => m.Loading),
  },
  {
    path: 'terminal',
    loadComponent: () => import('./terminal/terminal').then((m) => m.Terminal),
  },
];
