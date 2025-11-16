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

import { Store } from '@ngxs/store';
import { UsersState } from '../../state/users.state';
import { CreateUser, DeleteUser, LoadFilters, SetQueryParams } from '../../state/users.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersCreateDialog } from 'src/app/users/ui/dialogs/create/users-create.dialog';
import { ConfirmDialog } from 'src/app/shared/ui';
import { filter, switchMap } from 'rxjs';

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
  private readonly _store = inject(Store);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);

  private queryParams: QueryParameters = { size: 20, current: 1 };

  readonly columns = TABLE_COLUMNS.users;
  readonly pageSize: number[] = [20, 50, 100, 200];

  readonly users = toSignal(this._store.select(UsersState.users), { initialValue: null });
  readonly filters = toSignal(this._store.select(UsersState.filters), { initialValue: null });

  readonly dataSource = computed<User[]>(() => this.users()?.results || []);

  readonly page = computed((): Page => {
    const { page } = this.users() || {};
    const current = page ? page?.current - 1 : 1;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  ngOnInit(): void {
    this._store.dispatch(new LoadFilters());
    this._store.dispatch(new SetQueryParams(this.queryParams));
  }

  trackBy(index: number): number {
    return index;
  }

  createUser(): void {
    const config: MatDialogConfig = { width: '600px', data: null };
    this._dialog
      .open(UsersCreateDialog, config)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((user) => this._store.dispatch(new CreateUser(user))),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  deleteUser(id: string): void {
    const config: MatDialogConfig = {
      width: '600px',
      data: { title: 'You are about to delete this user' },
    };
    this._dialog
      .open(ConfirmDialog, config)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this._store.dispatch(new DeleteUser(id))),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._store.dispatch(new SetQueryParams(this.queryParams));
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this._store.dispatch(new SetQueryParams(this.queryParams));
      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';
    const sortValue = `${direction}${sort.active}`;

    this.queryParams = { ...this.queryParams, sort: sortValue };
    this._store.dispatch(new SetQueryParams(this.queryParams));
  }

  pageChange(page: PageEvent): void {
    this.queryParams = {
      ...this.queryParams,
      current: page.pageIndex + 1,
      size: page.pageSize,
    };
    this._store.dispatch(new SetQueryParams(this.queryParams));
  }
}
