import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TABLE_COLUMNS } from '@core/constants';
import { PaginatedResponse, Page, QueryParameters, User, UsersSummary } from '@shared/models';
import { FullNamePipe, ChipsColorDirective, EntityComponent, FiltersComponent } from '@shared/ui';
import * as UsersActions from '@users/store/users.actions';
import * as UsersSelectors from '@users/store/users.selectors';
import { AppState } from '@users/store/app.state';

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
  private readonly store = inject(Store<AppState>);

  readonly columns = TABLE_COLUMNS.users;

  readonly pageSize: number[] = [20, 50, 100, 200];

  private queryParams: QueryParameters = { size: 20, current: 1 };

  readonly usersResponse: Signal<PaginatedResponse<User> | null> = toSignal(
    this.store.select(UsersSelectors.selectUsersResponse),
    { initialValue: null },
  );

  readonly filters: Signal<UsersSummary | null> = toSignal(
    this.store.select(UsersSelectors.selectUsersSummary),
    { initialValue: null },
  );

  readonly dataSource = computed<User[]>(() => this.usersResponse()?.results || []);

  readonly page = computed((): Page => {
    const page = this.usersResponse()?.page;
    const current = page ? page.current - 1 : 0;

    return page ? { ...page, current } : ({ size: 0, total: 0, current: 0 } as Page);
  });

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(UsersActions.loadUsers({ queryParams: this.queryParams }));
    this.store.dispatch(UsersActions.loadUsersSummary());
  }

  trackBy(index: number): number {
    return index;
  }

  createUser(): void {
    this.store.dispatch(UsersActions.createUser({ user: {} as User }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(UsersActions.deleteUser({ id }));
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this.store.dispatch(UsersActions.loadUsers({ queryParams: this.queryParams }));
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this.store.dispatch(UsersActions.loadUsers({ queryParams: this.queryParams }));
      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';
    const sortValue = `${direction}${sort.active}`;

    this.queryParams = { ...this.queryParams, sort: sortValue };
    this.store.dispatch(UsersActions.loadUsers({ queryParams: this.queryParams }));
  }

  pageChange(page: PageEvent): void {
    this.queryParams = {
      ...this.queryParams,
      current: page.pageIndex + 1,
      size: page.pageSize,
    };
    this.store.dispatch(UsersActions.loadUsers({ queryParams: this.queryParams }));
  }
}
