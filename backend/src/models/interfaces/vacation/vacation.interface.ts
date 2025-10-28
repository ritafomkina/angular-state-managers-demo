import { VacationStatusEnum, VacationTypeEnum } from "@shared/models/enums";
import { User } from "../user/user.interface";
import { BaseEntity } from "../base-entity";

export interface Vacation extends BaseEntity {
  user: Pick<User, "id" | "firstName" | "lastName">;
  type: VacationTypeEnum;
  status: VacationStatusEnum;
  daysAvailable: number;
  daysRequested: number;
  createdDate: string;
  startDate: string;
  endDate: string;
}
