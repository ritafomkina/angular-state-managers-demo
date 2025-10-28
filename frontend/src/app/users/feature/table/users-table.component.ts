import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { BaseTable } from '@core/abstract';
import { TABLE_COLUMNS } from '@core/constants';
import { User } from '@shared/models/interfaces';
import { EntityComponent, FiltersComponent, FullNamePipe, ChipsColorDirective } from '@shared/ui';
import { UsersCreateDialog } from '@users/ui/dialogs/create/users-create.dialog';
import { USERS_STORE } from '@users/users.providers';

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
export default class UsersTableComponent extends BaseTable<User> {
  readonly _store = inject(USERS_STORE);

  readonly list = this._store.paginatedEntities;
  readonly filters = this._store.filters;

  readonly columns = TABLE_COLUMNS.users;

  ngOnInit(): void {
    this._store.searchEntities(this.queryParams);
  }

  createUser(): void {
    this._store.createEntity(UsersCreateDialog);
  }

  deleteUser(id: string): void {
    this._store.deleteEntity(id);
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._store.searchEntities(this.queryParams);
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this._store.searchEntities(this.queryParams);

      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';

    this.queryParams.sort = `${direction}${sort.active}`;

    this._store.searchEntities(this.queryParams);
  }

  pageChange(page: PageEvent): void {
    this.queryParams.current = ++page.pageIndex;
    this.queryParams.size = page.pageSize;

    this._store.searchEntities(this.queryParams);
  }
}
