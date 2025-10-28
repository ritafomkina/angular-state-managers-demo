import { CountriesEnum, UserStatusEnum } from "@shared/models/enums";

import { Contacts } from "./contacts.interface";
import { Project } from "../project";
import { BaseEntity } from "../base-entity";

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
