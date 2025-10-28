import { Page } from './page.interface';

export interface PaginatedResponse<T> {
  results: T[];
  page: Page;
}
