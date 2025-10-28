import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('src/app/users/users.routes'),
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];
