import {
  CountriesEnum,
  UserStatusEnum,
  EquipmentStatusEnum,
  ProjectStatusEnum,
  ProjectCategoriesEnum,
  VacationTypeEnum,
  VacationStatusEnum,
} from '@shared/models';

// Cache enum values to avoid recomputing Object.values() on every component instantiation
export const COUNTRIES_LIST = Object.values(CountriesEnum);
export const USER_STATUSES_LIST = Object.values(UserStatusEnum);
export const EQUIPMENT_STATUSES_LIST = Object.values(EquipmentStatusEnum);
export const PROJECT_STATUSES_LIST = Object.values(ProjectStatusEnum);
export const PROJECT_CATEGORIES_LIST = Object.values(ProjectCategoriesEnum);
export const VACATION_TYPES_LIST = Object.values(VacationTypeEnum);
export const VACATION_STATUSES_LIST = Object.values(VacationStatusEnum);
