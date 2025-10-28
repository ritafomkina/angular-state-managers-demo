import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('@users/users.routes'),
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];
