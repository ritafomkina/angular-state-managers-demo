import { CountriesEnum, ProjectStatusEnum } from '@shared/models/enums';
import { Technologies } from './technologies.interface';
import { BaseEntity } from '../base-entity';

export interface Project extends BaseEntity {
  icon: string;
  title: string;
  location: CountriesEnum;
  categories: string[];
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  status: ProjectStatusEnum;
  techs: Technologies;
  sprintCount: number;
  timezone: string;
  organization: number;
}
