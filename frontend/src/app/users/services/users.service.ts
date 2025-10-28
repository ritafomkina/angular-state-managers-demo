import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter, Observable, Subject, switchMap, tap } from 'rxjs';
import { SnackbarService } from '@core/services';
import { QueryParameters, PaginatedResponse, User, UsersSummary } from '@shared/models';
import { UsersApiService } from '@shared/services';
import { ConfirmDialog } from '@shared/ui';
import { UsersCreateDialog } from '@users/ui/dialogs/create/users-create.dialog';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';

@Injectable()
export class UsersService {
  private readonly _usersApiService = inject(UsersApiService);
  private readonly _dialog = inject(MatDialog);
  private readonly _snackbarService = inject(SnackbarService);
  private readonly _router = inject(Router);

  private readonly _userId$ = new Subject<string>();
  private readonly _queryParams$ = new Subject<QueryParameters>();

  setUserId(id: string): void {
    this._userId$.next(id);
  }

  setQueryParams(queryParams: QueryParameters): void {
    this._queryParams$.next(queryParams);
  }

  getUser(): Observable<User> {
    return this._userId$.pipe(switchMap((id) => this._usersApiService.findOne(id)));
  }

  getUsers(): Observable<PaginatedResponse<User>> {
    return this._queryParams$.pipe(
      switchMap((queryParams) => this._usersApiService.search(queryParams)),
    );
  }

  getFilters(): Observable<UsersSummary> {
    return this._usersApiService.summary();
  }

  createUser(): Observable<User> {
    return this._getDialogRef<null, User>(UsersCreateDialog, null).pipe(
      switchMap((user) =>
        this._usersApiService.create(user).pipe(
          tap({
            next: (newUser) => {
              this._snackbarService.open('User created successfully', 'success');
              this._router.navigate(['/users/', newUser.id]);
            },
            error: () => {
              this._snackbarService.open('Error creating user', 'error');
            },
          }),
        ),
      ),
    );
  }

  deleteUser(id: string): Observable<void> {
    const config: MatDialogConfig = {
      width: '600px',
      data: { title: 'You are about to delete this user' },
    };
    return this._dialog
      .open(ConfirmDialog, config)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() =>
          this._usersApiService.delete(id).pipe(
            tap({
              next: () => {
                this._snackbarService.open('User was successfully deleted', 'success');
                // is that fine? how to update the users in the store?
                this.setQueryParams({ current: 1, size: 20 });
              },
              error: () => {
                this._snackbarService.open('An error occured while deleting user', 'error');
              },
            }),
          ),
        ),
      );
  }

  updateUser<TData>(
    component: ComponentType<UserDescriptionDialog | UserContactsDialog>,
    data: TData,
    userId: string,
  ): Observable<User> {
    return this._getDialogRef<TData, Partial<User>>(component, data).pipe(
      switchMap((user) =>
        this._usersApiService.update(userId, user).pipe(
          tap({
            next: () => {
              this._snackbarService.open('User updated successfully', 'success');
              this.setUserId(userId);
            },
            error: () => {
              this._snackbarService.open('Error updating user', 'error');
            },
          }),
        ),
      ),
    );
  }

  private _getDialogRef<TData, TResult>(
    component: ComponentType<unknown>,
    data: TData,
  ): Observable<TResult> {
    const config: MatDialogConfig = { width: '600px', data };
    return this._dialog.open(component, config).afterClosed().pipe(filter(Boolean));
  }
}
