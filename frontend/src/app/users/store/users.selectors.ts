import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

export const selectUsersState = createFeatureSelector<UsersState>('users');

// Users list selectors
export const selectUsersResponse = createSelector(selectUsersState, (state) => state.usersResponse);

export const selectUsers = createSelector(
  selectUsersResponse,
  (response) => response?.results || [],
);

export const selectUsersPage = createSelector(selectUsersResponse, (response) => response?.page);

export const selectUsersLoading = createSelector(selectUsersState, (state) => state.usersLoading);

export const selectUsersError = createSelector(selectUsersState, (state) => state.usersError);

// Summary selectors
export const selectUsersSummary = createSelector(selectUsersState, (state) => state.summary);

export const selectSummaryLoading = createSelector(
  selectUsersState,
  (state) => state.summaryLoading,
);

export const selectSummaryError = createSelector(selectUsersState, (state) => state.summaryError);

// Selected user selectors
export const selectSelectedUser = createSelector(selectUsersState, (state) => state.selectedUser);

export const selectSelectedUserLoading = createSelector(
  selectUsersState,
  (state) => state.selectedUserLoading,
);

export const selectSelectedUserError = createSelector(
  selectUsersState,
  (state) => state.selectedUserError,
);
