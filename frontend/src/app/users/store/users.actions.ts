import { createAction, props } from '@ngrx/store';
import { User, QueryParameters, PaginatedResponse, UsersSummary } from '@shared/models';

// Load Users List
export const loadUsers = createAction(
  '[Users] Load Users',
  props<{ queryParams: QueryParameters }>(),
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ response: PaginatedResponse<User> }>(),
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>(),
);

// Load Users Summary/Filters
export const loadUsersSummary = createAction('[Users] Load Users Summary');

export const loadUsersSummarySuccess = createAction(
  '[Users] Load Users Summary Success',
  props<{ summary: UsersSummary }>(),
);

export const loadUsersSummaryFailure = createAction(
  '[Users] Load Users Summary Failure',
  props<{ error: string }>(),
);

// Load Single User
export const loadUser = createAction('[Users] Load User', props<{ id: string }>());

export const loadUserSuccess = createAction('[Users] Load User Success', props<{ user: User }>());

export const loadUserFailure = createAction(
  '[Users] Load User Failure',
  props<{ error: string }>(),
);

// Create User
export const createUser = createAction('[Users] Create User', props<{ user: User }>());

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: User }>(),
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>(),
);

// Update User Description
export const updateUserDescription = createAction(
  '[Users] Update User Description',
  props<{ user: User }>(),
);

export const updateUserDescriptionSuccess = createAction(
  '[Users] Update User Description Success',
  props<{ user: User }>(),
);

export const updateUserDescriptionFailure = createAction(
  '[Users] Update User Description Failure',
  props<{ error: string }>(),
);

// Update User Contacts
export const updateUserContacts = createAction(
  '[Users] Update User Contacts',
  props<{ user: User }>(),
);

export const updateUserContactsSuccess = createAction(
  '[Users] Update User Contacts Success',
  props<{ user: User }>(),
);

export const updateUserContactsFailure = createAction(
  '[Users] Update User Contacts Failure',
  props<{ error: string }>(),
);

// Delete User
export const deleteUser = createAction('[Users] Delete User', props<{ id: string }>());

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: string }>(),
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>(),
);

// Clear Selected User
export const clearSelectedUser = createAction('[Users] Clear Selected User');
