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

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/shared/ui';
import { UsersCreateDialog } from 'src/app/users/ui/dialogs/create/users-create.dialog';
import { UsersApiService } from 'src/app/shared/services';
import { SnackbarService } from 'src/app/core/services';
import { UsersQuery } from '../../state/users.query';
import { UsersStore } from '../../state/users.store';
import { filter, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

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
  private readonly _dialog = inject(MatDialog);
  private readonly _snackbarService = inject(SnackbarService);
  private readonly _router = inject(Router);
  private readonly _usersApi = inject(UsersApiService);
  private readonly _usersStore = inject(UsersStore);
  private readonly _usersQuery = inject(UsersQuery);
  private readonly _destroyRef = inject(DestroyRef);

  private queryParams: QueryParameters = { size: 20, current: 1 };

  readonly columns = TABLE_COLUMNS.users;
  readonly pageSize: number[] = [20, 50, 100, 200];

  readonly users = toSignal(this._usersQuery.selectUsers(), { initialValue: null });
  readonly filters = toSignal(this._usersQuery.selectFilters(), { initialValue: null });

  readonly dataSource = computed<User[]>(() => this.users()?.results || []);

  readonly page = computed((): Page => {
    const { page } = this.users() || {};
    const current = page ? page?.current - 1 : 1;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  ngOnInit(): void {
    this.loadFilters();
    this.loadUsers(this.queryParams);
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
        switchMap((user) =>
          this._usersApi.create(user).pipe(
            tap({
              next: (newUser) => {
                this._snackbarService.open('User created successfully', 'success');
                this._router.navigate(['/users/', newUser.id]);
                this._usersStore.update({ user: newUser });
                this.loadUsers(this.queryParams);
              },
              error: () => this._snackbarService.open('Error creating user', 'error'),
            }),
          ),
        ),
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
        switchMap(() =>
          this._usersApi.delete(id).pipe(
            tap({
              next: () => {
                this._snackbarService.open('User was successfully deleted', 'success');
                this.loadUsers(this.queryParams);
              },
              error: () =>
                this._snackbarService.open('An error occured while deleting user', 'error'),
            }),
          ),
        ),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this.loadUsers(this.queryParams);
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this.loadUsers(this.queryParams);
      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';
    const sortValue = `${direction}${sort.active}`;

    this.queryParams = { ...this.queryParams, sort: sortValue };
    this.loadUsers(this.queryParams);
  }

  pageChange(page: PageEvent): void {
    this.queryParams = {
      ...this.queryParams,
      current: page.pageIndex + 1,
      size: page.pageSize,
    };
    this.loadUsers(this.queryParams);
  }

  private loadUsers(queryParams: QueryParameters): void {
    this._usersStore.update({ queryParams });
    this._usersApi
      .search(queryParams)
      .pipe(
        tap({
          next: (users) => this._usersStore.update({ users }),
          error: () => this._snackbarService.open('Error loading users', 'error'),
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private loadFilters(): void {
    if (this.filters()) {
      return;
    }
    this._usersApi
      .summary()
      .pipe(
        tap({
          next: (filters) => this._usersStore.update({ filters }),
          error: () => this._snackbarService.open('Error loading filters', 'error'),
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
