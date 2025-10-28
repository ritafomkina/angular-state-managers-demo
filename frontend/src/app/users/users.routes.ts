import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('src/app/users/users.container'),
    children: [
      {
        path: '',
        loadComponent: () => import('src/app/users/feature/table/users-table.component'),
      },
      {
        path: ':id',
        loadComponent: () => import('src/app/users/feature/details/user-details.component'),
      },
    ],
  },
] as Routes;
