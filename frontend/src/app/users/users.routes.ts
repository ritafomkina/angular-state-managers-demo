import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@users/users.container'),
    children: [
      {
        path: '',
        loadComponent: () => import('@users/feature/table/users-table.component'),
      },
      {
        path: ':id',
        loadComponent: () => import('@users/feature/details/user-details.component'),
      },
    ],
  },
] as Routes;
