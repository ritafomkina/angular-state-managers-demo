import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

import { BaseCrudApiService } from '@shared/api';

const getLastPage = (size: number, total: number): number => Math.ceil(total / size);

import { User } from '@shared/models';

export interface UserSearchState {
  users: User[];
  lastPage: number;
}

export function initUserSearchState(): UserSearchState {
  return { users: [], lastPage: 1 };
}

export const UserSearchStore = signalStore(
  withState<UserSearchState>(initUserSearchState()),
  withMethods((store, usersApi = inject(BaseCrudApiService)) => ({
    findUser: rxMethod<string>(
      pipe(
        switchMap((name) =>
          usersApi.search({ firstName: name }).pipe(
            tap({
              next: (list) => {
                const lastPage =
                  store.lastPage() === 1
                    ? getLastPage(list.page.size, list.page.total)
                    : store.lastPage();

                patchState(store, {
                  users: list.results,
                  lastPage,
                });
              },
              error: () =>
                patchState(store, {
                  users: initUserSearchState().users,
                }),
            }),
          ),
        ),
      ),
    ),
    getMore: rxMethod<number>(
      pipe(
        switchMap((page) =>
          usersApi.search({ current: page }).pipe(
            tap({
              next: (list) => {
                patchState(store, {
                  users: [...store.users(), ...list.results],
                });
              },
              error: () => {
                patchState(store, {
                  users: initUserSearchState().users,
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
