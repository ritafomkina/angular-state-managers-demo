import { User, PaginatedResponse, UsersSummary } from '@shared/models';

export interface UsersState {
  // Users list state
  usersResponse: PaginatedResponse<User> | null;
  usersLoading: boolean;
  usersError: string | null;

  // Filters/summary state
  summary: UsersSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;

  // Single user state
  selectedUser: User | null;
  selectedUserLoading: boolean;
  selectedUserError: string | null;
}

export const initialUsersState: UsersState = {
  usersResponse: null,
  usersLoading: false,
  usersError: null,

  summary: null,
  summaryLoading: false,
  summaryError: null,

  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,
};
