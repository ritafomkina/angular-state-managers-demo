import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@vacations/vacations.container'),
    data: {
      breadcrumb: 'Vacations',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('@vacations/feature/table/vacations-table.component'),
      },
    ],
  },
] as Routes;
