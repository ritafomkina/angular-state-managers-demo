import { BaseEntity, Contacts, CountriesEnum, Project, UserStatusEnum } from '@shared/models';

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: string;
  photo: string;
  startDate: string;
  status: UserStatusEnum;
  contacts: Contacts;
  location: CountriesEnum;
  project: Partial<Project>;
}
