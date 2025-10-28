import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TABLE_COLUMNS } from '@core/constants';
import { Page, QueryParameters, User } from '@shared/models';
import { EntityComponent, FiltersComponent, FullNamePipe, ChipsColorDirective } from '@shared/ui';
import { USERS_STORE } from '../../store/users.store';

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
  private readonly _usersStore = inject(USERS_STORE);

  readonly columns = TABLE_COLUMNS.users;

  readonly pageSize: number[] = [20, 50, 100, 200];

  private queryParams: QueryParameters = { size: 20, current: 1 };

  readonly users = this._usersStore.users;
  readonly filters = this._usersStore.filters;

  readonly dataSource = computed<User[]>(() => this.users()?.results || []);

  readonly page = computed((): Page => {
    const { page } = this.users() || {};
    const current = page ? page?.current - 1 : 1;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  ngOnInit(): void {
    this._usersStore.getUsers(this.queryParams);
  }

  trackBy(index: number): number {
    return index;
  }

  createUser(): void {
    this._usersStore.createUser();
  }

  deleteUser(id: string): void {
    this._usersStore.deleteUser(id);
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._usersStore.getUsers(this.queryParams);
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this._usersStore.getUsers(this.queryParams);
      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';
    const sortValue = `${direction}${sort.active}`;

    this.queryParams = { ...this.queryParams, sort: sortValue };
    this._usersStore.getUsers(this.queryParams);
  }

  pageChange(page: PageEvent): void {
    this.queryParams = {
      ...this.queryParams,
      current: page.pageIndex + 1,
      size: page.pageSize,
    };
    this._usersStore.getUsers(this.queryParams);
  }
}
