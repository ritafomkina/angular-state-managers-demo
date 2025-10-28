import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@equipment/equipment.container'),
    children: [
      {
        path: '',
        loadComponent: () => import('@equipment/feature/list/equipment-list.component'),
      },
      {
        path: ':id',
        loadComponent: () => import('@equipment/feature/details/equipment-details.component'),
      },
    ],
  },
] as Routes;
