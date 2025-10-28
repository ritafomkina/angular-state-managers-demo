import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { UsersApiService } from '@shared/services';
import { SnackbarService } from '@core/services';
import * as UsersActions from './users.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersCreateDialog } from '@users/ui/dialogs/create/users-create.dialog';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';
import { filter } from 'rxjs/operators';
import { ConfirmDialog } from '@shared/ui';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersApiService = inject(UsersApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Load users list
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(({ queryParams }) =>
        this.usersApiService.search(queryParams).pipe(
          map((response) => UsersActions.loadUsersSuccess({ response })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ error: error.message || 'Error loading users' })),
          ),
        ),
      ),
    ),
  );

  // Load users summary
  loadUsersSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsersSummary),
      switchMap(() =>
        this.usersApiService.summary().pipe(
          map((summary) => UsersActions.loadUsersSummarySuccess({ summary })),
          catchError((error) =>
            of(
              UsersActions.loadUsersSummaryFailure({
                error: error.message || 'Error loading summary',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Load single user
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      switchMap(({ id }) =>
        this.usersApiService.findOne(id).pipe(
          map((user) => UsersActions.loadUserSuccess({ user })),
          catchError((error) =>
            of(UsersActions.loadUserFailure({ error: error.message || 'Error loading user' })),
          ),
        ),
      ),
    ),
  );

  // Create user
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap(() => {
        const config: MatDialogConfig = { width: '600px', data: null };
        return this.dialog
          .open(UsersCreateDialog, config)
          .afterClosed()
          .pipe(
            filter(Boolean),
            switchMap((user) =>
              this.usersApiService.create(user).pipe(
                map((createdUser) => UsersActions.createUserSuccess({ user: createdUser })),
                catchError((error) =>
                  of(
                    UsersActions.createUserFailure({
                      error: error.message || 'Error creating user',
                    }),
                  ),
                ),
              ),
            ),
          );
      }),
    ),
  );

  createUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.createUserSuccess),
        tap(({ user }) => {
          this.snackbarService.open('User created successfully', 'success');
          this.router.navigate(['/users', user.id]);
        }),
      ),
    { dispatch: false },
  );

  createUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.createUserFailure),
        tap(() => {
          this.snackbarService.open('Error creating user', 'error');
        }),
      ),
    { dispatch: false },
  );

  // Update user description
  updateUserDescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserDescription),
      switchMap(({ user }) => {
        const config: MatDialogConfig = { width: '600px', data: user };
        return this.dialog
          .open(UserDescriptionDialog, config)
          .afterClosed()
          .pipe(
            filter(Boolean),
            switchMap((updatedData) =>
              this.usersApiService.update(user.id, updatedData).pipe(
                map((updatedUser) =>
                  UsersActions.updateUserDescriptionSuccess({ user: updatedUser }),
                ),
                catchError((error) =>
                  of(
                    UsersActions.updateUserDescriptionFailure({
                      error: error.message || 'Error updating user',
                    }),
                  ),
                ),
              ),
            ),
          );
      }),
    ),
  );

  updateUserDescriptionSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserDescriptionSuccess),
        tap(() => {
          this.snackbarService.open('User updated successfully', 'success');
        }),
      ),
    { dispatch: false },
  );

  updateUserDescriptionFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserDescriptionFailure),
        tap(() => {
          this.snackbarService.open('Error updating user', 'error');
        }),
      ),
    { dispatch: false },
  );

  // Update user contacts
  updateUserContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserContacts),
      switchMap(({ user }) => {
        const config: MatDialogConfig = { width: '600px', data: user.contacts };
        return this.dialog
          .open(UserContactsDialog, config)
          .afterClosed()
          .pipe(
            filter(Boolean),
            switchMap((updatedData) =>
              this.usersApiService.update(user.id, updatedData).pipe(
                map((updatedUser) => UsersActions.updateUserContactsSuccess({ user: updatedUser })),
                catchError((error) =>
                  of(
                    UsersActions.updateUserContactsFailure({
                      error: error.message || 'Error updating contacts',
                    }),
                  ),
                ),
              ),
            ),
          );
      }),
    ),
  );

  updateUserContactsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserContactsSuccess),
        tap(() => {
          this.snackbarService.open('User updated successfully', 'success');
        }),
      ),
    { dispatch: false },
  );

  updateUserContactsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserContactsFailure),
        tap(() => {
          this.snackbarService.open('Error updating user', 'error');
        }),
      ),
    { dispatch: false },
  );

  // Delete user
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ id }) => {
        const config: MatDialogConfig = {
          width: '600px',
          data: { title: 'You are about to delete this user' },
        };
        return this.dialog
          .open(ConfirmDialog, config)
          .afterClosed()
          .pipe(
            filter(Boolean),
            switchMap(() =>
              this.usersApiService.delete(id).pipe(
                map(() => UsersActions.deleteUserSuccess({ id })),
                catchError((error) =>
                  of(
                    UsersActions.deleteUserFailure({
                      error: error.message || 'Error deleting user',
                    }),
                  ),
                ),
              ),
            ),
          );
      }),
    ),
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUserSuccess),
        tap(() => {
          this.snackbarService.open('User was successfully deleted', 'success');
        }),
      ),
    { dispatch: false },
  );

  deleteUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUserFailure),
        tap(() => {
          this.snackbarService.open('An error occured while deleting user', 'error');
        }),
      ),
    { dispatch: false },
  );
}
