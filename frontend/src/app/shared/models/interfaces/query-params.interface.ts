import { Page } from './page.interface';

export interface QueryParameters extends Partial<Omit<Page, 'total'>> {
  sort?: string;
  filter?: string;
  title?: string;
  name?: string;
  category?: string;
  equipmentId?: string;
  userId?: string;
  owner?: string;
  parent?: string;
  level?: string;
  department?: string;
  owner__isnull?: boolean;
  size?: number;
  type?: string | number;
  status?: string | number;
  groupBy?: string;
  full?: boolean;
}
