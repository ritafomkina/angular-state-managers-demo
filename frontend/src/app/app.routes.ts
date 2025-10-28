import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('@users/users.routes'),
  },
  {
    path: 'projects',
    loadChildren: () => import('@projects/projects.routes'),
  },
  {
    path: 'vacations',
    loadChildren: () => import('@vacations/vacations.routes'),
  },
  {
    path: 'equipment',
    loadChildren: () => import('@equipment/equipment.routes'),
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];
