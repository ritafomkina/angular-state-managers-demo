import { ApiSuffixesEnum, NavigationLink } from '@shared/models';

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  {
    name: 'Users',
    routerLink: ApiSuffixesEnum.USERS,
  },
  {
    name: 'Projects',
    routerLink: ApiSuffixesEnum.PROJECTS,
  },
  {
    name: 'Vacations',
    routerLink: ApiSuffixesEnum.VACATIONS,
  },

  {
    name: 'Equipment',
    routerLink: ApiSuffixesEnum.EQUIPMENT,
  },
];
