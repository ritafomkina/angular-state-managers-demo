import { EquipmentStatusEnum } from '@shared/models/enums';

import { User } from '../user';
import { BaseEntity } from '../base-entity';

export interface Equipment extends BaseEntity {
  title: string;
  owner: Pick<User, 'id' | 'firstName' | 'lastName'> | null;
  description: string;
  receiptTimestamp: string;
  wasUsed: boolean;
  hasDefect: boolean;
  imageUrl: string;
  status?: EquipmentStatusEnum;
}
