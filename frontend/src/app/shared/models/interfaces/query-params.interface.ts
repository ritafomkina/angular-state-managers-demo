import { Page } from './page.interface';

export interface QueryParameters extends Partial<Omit<Page, 'total'>> {
  sort?: string;
  filter?: string;
  title?: string;
  firstName?: string;
}
