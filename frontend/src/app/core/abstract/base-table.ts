import { computed, Signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { PaginatedResponse, Page, QueryParameters, BaseSummary } from '@shared/models';

export abstract class BaseTable<T> {
  abstract readonly columns: string[];
  abstract readonly list: Signal<PaginatedResponse<T> | null>;
  abstract readonly filters: Signal<BaseSummary | null>;

  abstract filterChange(filter: string): void;
  abstract sortChange(sort: Sort): void;
  abstract pageChange(page: PageEvent): void;

  readonly pageSize: number[] = [20, 50, 100, 200];

  queryParams: QueryParameters = { size: 20, current: 1 };

  readonly dataSource = computed<T[]>(() => this.list()?.results || []);

  readonly page = computed((): Page => {
    const { page } = this.list() || {};
    const current = page ? page?.current - 1 : 1;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  trackBy(index: number): number {
    return index;
  }
}
