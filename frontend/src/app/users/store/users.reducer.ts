import { createReducer, on } from '@ngrx/store';
import { initialUsersState } from './users.state';
import * as UsersActions from './users.actions';

export const usersReducer = createReducer(
  initialUsersState,

  // Load Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    usersLoading: true,
    usersError: null,
  })),
  on(UsersActions.loadUsersSuccess, (state, { response }) => ({
    ...state,
    usersResponse: response,
    usersLoading: false,
    usersError: null,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    usersLoading: false,
    usersError: error,
  })),

  // Load Users Summary
  on(UsersActions.loadUsersSummary, (state) => ({
    ...state,
    summaryLoading: true,
    summaryError: null,
  })),
  on(UsersActions.loadUsersSummarySuccess, (state, { summary }) => ({
    ...state,
    summary,
    summaryLoading: false,
    summaryError: null,
  })),
  on(UsersActions.loadUsersSummaryFailure, (state, { error }) => ({
    ...state,
    summaryLoading: false,
    summaryError: error,
  })),

  // Load Single User
  on(UsersActions.loadUser, (state) => ({
    ...state,
    selectedUserLoading: true,
    selectedUserError: null,
  })),
  on(UsersActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    selectedUserLoading: false,
    selectedUserError: null,
  })),
  on(UsersActions.loadUserFailure, (state, { error }) => ({
    ...state,
    selectedUserLoading: false,
    selectedUserError: error,
  })),

  // Create User
  on(UsersActions.createUser, (state) => ({
    ...state,
    usersLoading: true,
    usersError: null,
  })),
  on(UsersActions.createUserSuccess, (state, { user }) => {
    if (!state.usersResponse) return state;
    return {
      ...state,
      usersResponse: {
        ...state.usersResponse,
        results: [...state.usersResponse.results, user],
      },
      usersLoading: false,
      usersError: null,
    };
  }),
  on(UsersActions.createUserFailure, (state, { error }) => ({
    ...state,
    usersLoading: false,
    usersError: error,
  })),

  // Update User Description
  on(UsersActions.updateUserDescription, (state) => ({
    ...state,
    selectedUserLoading: true,
    selectedUserError: null,
  })),
  on(UsersActions.updateUserDescriptionSuccess, (state, { user }) => {
    const updatedResponse = state.usersResponse
      ? {
          ...state.usersResponse,
          results: state.usersResponse.results.map((u) => (u.id === user.id ? user : u)),
        }
      : null;
    return {
      ...state,
      selectedUser: user,
      usersResponse: updatedResponse,
      selectedUserLoading: false,
      selectedUserError: null,
    };
  }),
  on(UsersActions.updateUserDescriptionFailure, (state, { error }) => ({
    ...state,
    selectedUserLoading: false,
    selectedUserError: error,
  })),

  // Update User Contacts
  on(UsersActions.updateUserContacts, (state) => ({
    ...state,
    selectedUserLoading: true,
    selectedUserError: null,
  })),
  on(UsersActions.updateUserContactsSuccess, (state, { user }) => {
    const updatedResponse = state.usersResponse
      ? {
          ...state.usersResponse,
          results: state.usersResponse.results.map((u) => (u.id === user.id ? user : u)),
        }
      : null;
    return {
      ...state,
      selectedUser: user,
      usersResponse: updatedResponse,
      selectedUserLoading: false,
      selectedUserError: null,
    };
  }),
  on(UsersActions.updateUserContactsFailure, (state, { error }) => ({
    ...state,
    selectedUserLoading: false,
    selectedUserError: error,
  })),

  // Delete User
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    usersLoading: true,
    usersError: null,
  })),
  on(UsersActions.deleteUserSuccess, (state, { id }) => {
    if (!state.usersResponse) return state;
    return {
      ...state,
      usersResponse: {
        ...state.usersResponse,
        results: state.usersResponse.results.filter((user) => user.id !== id),
      },
      usersLoading: false,
      usersError: null,
    };
  }),
  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    usersLoading: false,
    usersError: error,
  })),

  // Clear Selected User
  on(UsersActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
    selectedUserLoading: false,
    selectedUserError: null,
  })),
);
