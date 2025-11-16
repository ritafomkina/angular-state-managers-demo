import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { PaginatedResponse, QueryParameters, User, UsersSummary } from 'src/app/shared/models';

export interface UsersState {
  user: User | null;
  users: PaginatedResponse<User> | null;
  filters: UsersSummary | null;
  queryParams: QueryParameters | null;
}

export function createInitialState(): UsersState {
  return {
    user: null,
    users: null,
    filters: null,
    queryParams: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class UsersStore extends Store<UsersState> {
  constructor() {
    super(createInitialState());
  }
}
