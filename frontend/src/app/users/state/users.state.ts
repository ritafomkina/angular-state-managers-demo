import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginatedResponse, QueryParameters, User, UsersSummary } from 'src/app/shared/models';
import { UsersApiService } from 'src/app/shared/services';
import { SnackbarService } from 'src/app/core/services';
import { Router } from '@angular/router';
import {
  CreateUser,
  DeleteUser,
  LoadFilters,
  SetQueryParams,
  SetUserId,
  UpdateUser,
} from './users.actions';
import { tap } from 'rxjs/operators';

export interface UsersStateModel {
  user: User | null;
  users: PaginatedResponse<User> | null;
  filters: UsersSummary | null;
  queryParams: QueryParameters | null;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    user: null,
    users: null,
    filters: null,
    queryParams: null,
  },
})
@Injectable()
export class UsersState {
  private readonly _api = inject(UsersApiService);
  private readonly _snackbar = inject(SnackbarService);
  private readonly _router = inject(Router);

  @Selector()
  static user(state: UsersStateModel): User | null {
    return state.user;
  }

  @Selector()
  static users(state: UsersStateModel): PaginatedResponse<User> | null {
    return state.users;
  }

  @Selector()
  static filters(state: UsersStateModel): UsersSummary | null {
    return state.filters;
  }

  @Selector()
  static queryParams(state: UsersStateModel): QueryParameters | null {
    return state.queryParams;
  }

  @Action(SetUserId)
  setUserId(ctx: StateContext<UsersStateModel>, { id }: SetUserId) {
    return this._api.findOne(id).pipe(
      tap({
        next: (user) => ctx.patchState({ user }),
        error: () => this._snackbar.open('Error loading user', 'error'),
      }),
    );
  }

  @Action(SetQueryParams)
  setQueryParams(ctx: StateContext<UsersStateModel>, { query }: SetQueryParams) {
    return this._api.search(query).pipe(
      tap({
        next: (users) => ctx.patchState({ users }),
        error: () => this._snackbar.open('Error loading users', 'error'),
      }),
    );
  }

  @Action(LoadFilters)
  loadFilters(ctx: StateContext<UsersStateModel>) {
    const filters = ctx.getState().filters;
    if (filters) {
      return;
    }
    return this._api.summary().pipe(
      tap({
        next: (summary) => ctx.patchState({ filters: summary }),
        error: () => this._snackbar.open('Error loading filters', 'error'),
      }),
    );
  }

  @Action(CreateUser)
  createUser(ctx: StateContext<UsersStateModel>, { user }: CreateUser) {
    return this._api.create(user).pipe(
      tap({
        next: (newUser) => {
          this._snackbar.open('User created successfully', 'success');
          ctx.patchState({ user: newUser });
          const params = ctx.getState().queryParams;
          if (params) {
            ctx.dispatch(new SetQueryParams(params));
          }
          this._router.navigate(['/users/', newUser.id]);
        },
        error: () => this._snackbar.open('Error creating user', 'error'),
      }),
    );
  }

  @Action(UpdateUser)
  updateUser<T>(ctx: StateContext<UsersStateModel>, { userId, data }: UpdateUser<T>) {
    return this._api.update(userId, data).pipe(
      tap({
        next: () => {
          this._snackbar.open('User updated successfully', 'success');
          ctx.dispatch(new SetUserId(userId));
        },
        error: () => this._snackbar.open('Error updating user', 'error'),
      }),
    );
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<UsersStateModel>, { userId }: DeleteUser) {
    return this._api.delete(userId).pipe(
      tap({
        next: () => {
          this._snackbar.open('User was successfully deleted', 'success');
          const params = ctx.getState().queryParams || { current: 1, size: 20 };
          ctx.dispatch(new SetQueryParams(params));
        },
        error: () => this._snackbar.open('An error occured while deleting user', 'error'),
      }),
    );
  }
}
