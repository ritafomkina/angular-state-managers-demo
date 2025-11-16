import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UsersState, UsersStore } from './users.store';
import { Observable } from 'rxjs';
import { PaginatedResponse, QueryParameters, User, UsersSummary } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends Query<UsersState> {
  constructor(protected override store: UsersStore) {
    super(store);
  }

  selectUser(): Observable<User | null> {
    return this.select((state) => state.user);
  }

  selectUsers(): Observable<PaginatedResponse<User> | null> {
    return this.select((state) => state.users);
  }

  selectFilters(): Observable<UsersSummary | null> {
    return this.select((state) => state.filters);
  }

  selectQueryParams(): Observable<QueryParameters | null> {
    return this.select((state) => state.queryParams);
  }
}
