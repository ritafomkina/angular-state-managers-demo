import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('@projects/projects.container'),
    children: [
      {
        path: '',
        loadComponent: () => import('@projects/feature/table/projects-table.component'),
      },
      {
        path: ':id',
        loadComponent: () => import('@projects/feature/details/project-details.component'),
      },
    ],
  },
] as Routes;
