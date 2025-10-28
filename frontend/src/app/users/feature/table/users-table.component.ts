import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TABLE_COLUMNS } from 'src/app/core/constants';
import { Page, QueryParameters, User } from 'src/app/shared/models';
import {
  FullNamePipe,
  ChipsColorDirective,
  EntityComponent,
  FiltersComponent,
} from 'src/app/shared/ui';

import { UsersService } from 'src/app/users/services/users.service';

const imports = [
  RouterLink,
  EntityComponent,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatChipsModule,
  FullNamePipe,
  ChipsColorDirective,
  DatePipe,
  TitleCasePipe,
  FiltersComponent,
];

@Component({
  imports,
  templateUrl: './users-table.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersTableComponent implements OnInit {
  private readonly _usersService = inject(UsersService);
  private readonly _destroyRef = inject(DestroyRef);

  private queryParams: QueryParameters = { size: 20, current: 1 };

  readonly columns = TABLE_COLUMNS.users;
  readonly pageSize: number[] = [20, 50, 100, 200];

  readonly users = toSignal(this._usersService.getUsers(), { initialValue: null });
  readonly filters = toSignal(this._usersService.getFilters(), { initialValue: null });

  readonly dataSource = computed<User[]>(() => this.users()?.results || []);

  readonly page = computed((): Page => {
    const { page } = this.users() || {};
    const current = page ? page?.current - 1 : 1;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  ngOnInit(): void {
    this._usersService.setQueryParams(this.queryParams);
  }

  trackBy(index: number): number {
    return index;
  }

  createUser(): void {
    this._usersService.createUser().pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }

  deleteUser(id: string): void {
    this._usersService.deleteUser(id).pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._usersService.setQueryParams(this.queryParams);
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this._usersService.setQueryParams(this.queryParams);
      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';
    const sortValue = `${direction}${sort.active}`;

    this.queryParams = { ...this.queryParams, sort: sortValue };
    this._usersService.setQueryParams(this.queryParams);
  }

  pageChange(page: PageEvent): void {
    this.queryParams = {
      ...this.queryParams,
      current: page.pageIndex + 1,
      size: page.pageSize,
    };
    this._usersService.setQueryParams(this.queryParams);
  }
}
