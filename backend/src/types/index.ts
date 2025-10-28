// Re-export all types from models
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  size: number;
  total: number;
  current: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: Page;
}

export interface Contacts {
  email: string;
  phone: string;
}

export interface Technologies {
  frontend: string[];
  backend: string[];
  qa: string[];
  db: string[];
  mobile: string[];
  other: string[];
  manager: string[];
}

// Enums
export enum UserStatusEnum {
  Works = "works",
  Vacation = "vacation",
  Sick = "sick",
  DayOff = "dayOff",
}

export enum ProjectStatusEnum {
  Active = "active",
  Completed = "completed",
  Support = "support",
}

export enum EquipmentStatusEnum {
  Occupied = "occupied",
  Available = "available",
}

export enum VacationTypeEnum {
  SickLeave = "sickLeave",
  Vacation = "vacation",
  DayOff = "dayOff",
}

export enum VacationStatusEnum {
  Approved = "approved",
  Rejected = "rejected",
  Request = "request",
  Expired = "expired",
}

export enum CountriesEnum {
  USA = "USA",
  Canada = "Canada",
  UK = "UK",
  Australia = "Australia",
  NewZealand = "New Zealand",
}

// Entity interfaces
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
  project: Partial<Project> | null;
}

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
  sprintCount: number;
  timezone: string;
  organization: number;
}

export interface Equipment extends BaseEntity {
  title: string;
  owner: Pick<User, "id" | "firstName" | "lastName"> | null;
  description: string;
  receiptTimestamp: string;
  wasUsed: boolean;
  hasDefect: boolean;
  imageUrl: string;
  status?: EquipmentStatusEnum;
}

export interface Vacation extends BaseEntity {
  user: Pick<User, "id" | "firstName" | "lastName" | "photo">;
  type: VacationTypeEnum;
  status: VacationStatusEnum;
  daysAvailable: number;
  daysRequested: number;
  startDate: string;
  endDate: string;
}

// Summary types
export type BaseSummary<T extends string = string> = Record<T, number>;

export type UsersSummary = BaseSummary<
  "works" | "vacation" | "sick" | "dayOff" | "total"
>;
export type ProjectsSummary = BaseSummary<
  "total" | "support" | "completed" | "active"
>;
export type EquipmentSummary = BaseSummary<"total" | "occupied" | "available">;
export type VacationsSummary = BaseSummary<
  "total" | "sickLeave" | "dayOff" | "vacation"
>;

// Query params
export interface QueryParams {
  filter?: string;
  sort?: string;
  current?: number;
  size?: number;
}

// Database row types (flattened for SQL)
export interface UserRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: string;
  photo: string;
  startDate: string;
  status: string;
  email: string;
  phone: string;
  location: string;
  projectId: number | null;
  projectTitle: string;
}

export interface ProjectRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  icon: string;
  title: string;
  location: string;
  categories: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  status: string;
  sprintCount: number;
  timezone: string;
  organization: number;
}

export interface EquipmentRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  ownerId: number | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  description: string;
  receiptTimestamp: string;
  wasUsed: number;
  hasDefect: number;
  imageUrl: string;
  status: string;
}

export interface VacationRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userPhoto: string;
  type: string;
  status: string;
  daysAvailable: number;
  daysRequested: number;
  startDate: string;
  endDate: string;
}
