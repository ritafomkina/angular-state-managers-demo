import { CountriesEnum, UserStatusEnum } from '@shared/models';

// Cache enum values to avoid recomputing Object.values() on every component instantiation
export const COUNTRIES_LIST = Object.values(CountriesEnum);
export const USER_STATUSES_LIST = Object.values(UserStatusEnum);
