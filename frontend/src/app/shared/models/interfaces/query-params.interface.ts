import { Page } from './page.interface';

export interface QueryParameters extends Partial<Omit<Page, 'total'>> {
  sort?: string;
  filter?: string;
  status?: string;
}
