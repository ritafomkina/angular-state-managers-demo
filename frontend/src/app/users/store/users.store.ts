import { inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '@core/services';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UsersApiService } from '@shared/services';
import { QueryParameters, User, PaginatedResponse, UsersSummary, Contacts } from '@shared/models';
import { UsersCreateDialog } from '@users/ui/dialogs/create/users-create.dialog';
import { filter, Observable, pipe, switchMap, tap } from 'rxjs';
import { ComponentType } from '@angular/cdk/overlay';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { ConfirmDialog } from '@shared/ui';

export interface UsersState {
  users: PaginatedResponse<User> | null;
  currentUser: User | null;
  filters: UsersSummary | null;
}

export function initUsersState(): UsersState {
  return { users: null, currentUser: null, filters: null };
}

export const USERS_STORE = signalStore(
  withState<UsersState>(initUsersState()),
  withMethods(
    (
      store,
      usersApiService = inject(UsersApiService),
      dialog = inject(MatDialog),
      router = inject(Router),
      snackbarService = inject(SnackbarService),
    ) => {
      function getDialogRef<TData, TResult>(
        component: ComponentType<
          UserDescriptionDialog | UserContactsDialog | UsersCreateDialog | ConfirmDialog
        >,
        data: TData,
      ): Observable<TResult> {
        const config: MatDialogConfig = { width: '600px', data };

        return dialog.open(component, config).afterClosed().pipe(filter(Boolean));
      }

      const actions = {
        getUsers: rxMethod<QueryParameters>(
          pipe(
            switchMap((queryParams) =>
              usersApiService.search(queryParams).pipe(
                tap({
                  next: (users) => {
                    patchState(store, {
                      users,
                    });
                  },
                  error: () => {
                    patchState(store, {
                      users: initUsersState().users,
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        getFilters: rxMethod<void>(
          pipe(
            switchMap(() =>
              usersApiService.summary().pipe(
                tap({
                  next: (filters) => {
                    patchState(store, {
                      filters,
                    });
                  },
                  error: () => {
                    patchState(store, {
                      filters: initUsersState().filters,
                    });
                  },
                }),
              ),
            ),
          ),
        ),
        getUser: rxMethod<string>(
          pipe(
            switchMap((id) =>
              usersApiService.findOne(id).pipe(
                tap({
                  next: (user) => {
                    patchState(store, { currentUser: user });
                  },
                  error: () => {
                    patchState(store, { currentUser: null });
                  },
                }),
              ),
            ),
          ),
        ),
        createUser: rxMethod<void>(
          pipe(
            switchMap(() =>
              dialog
                .open(UsersCreateDialog, { width: '600px' })
                .afterClosed()
                .pipe(
                  filter(Boolean),
                  switchMap((user: User) =>
                    usersApiService.create(user).pipe(
                      tap({
                        next: (newUser) => {
                          snackbarService.open('User created successfully', 'success');
                          actions.getUsers({ size: 20, current: 1 });
                          router.navigate(['/users', newUser.id]);
                        },
                        error: () => {
                          snackbarService.open('Error creating user', 'error');
                        },
                      }),
                    ),
                  ),
                ),
            ),
          ),
        ),
        updateUser: rxMethod<{
          component: ComponentType<
            UserDescriptionDialog | UserContactsDialog | UsersCreateDialog | ConfirmDialog
          >;
          data: User | Contacts;
          userId: string;
        }>(
          pipe(
            switchMap(({ component, data, userId }) =>
              getDialogRef<User | Contacts, User | Contacts>(component, data).pipe(
                switchMap((updatedData) =>
                  usersApiService.update(userId, updatedData).pipe(
                    tap({
                      next: (user) => {
                        patchState(store, { currentUser: user });
                        snackbarService.open('User updated successfully', 'success');
                      },
                      error: () => {
                        patchState(store, { currentUser: null });
                        snackbarService.open('Error updating user', 'error');
                      },
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
        deleteUser: rxMethod<string>(
          pipe(
            switchMap((id) => {
              const config: MatDialogConfig = {
                width: '600px',
                data: { title: 'You are about to delete this user' },
              };
              return dialog
                .open(ConfirmDialog, config)
                .afterClosed()
                .pipe(
                  filter(Boolean),
                  switchMap(() =>
                    usersApiService.delete(id).pipe(
                      tap({
                        next: () => {
                          snackbarService.open('User was successfully deleted', 'success');
                          const filteredUsers = (store.users()!.results = store
                            .users()!
                            .results.filter((user) => user.id !== id));
                          patchState(store, {
                            users: { ...store.users()!, results: filteredUsers },
                          });
                        },
                        error: () => {
                          snackbarService.open('An error occured while deleting user', 'error');
                        },
                      }),
                    ),
                  ),
                );
            }),
          ),
        ),
      };

      return actions;
    },
  ),
  withHooks({
    onInit: (store) => {
      store.getFilters();
    },
  }),
);
