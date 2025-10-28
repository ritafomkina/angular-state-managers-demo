import { Provider } from '@angular/core';
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withBaseMethods, BASE_MESSAGES, BASE_REDIRECT_URL } from '@shared/store';
import { ApiSuffixesEnum, User, UsersSummary } from '@shared/models';
import { BaseCrudApiService, BASE_API_SUFFIX } from '@shared/api';

export const USERS_STORE = signalStore(withEntities<User>(), withBaseMethods());

export const USERS_PROVIDERS: Provider[] = [
  [
    {
      provide: BASE_API_SUFFIX,
      useValue: ApiSuffixesEnum.USERS,
    },
    {
      provide: BASE_MESSAGES,
      useValue: {
        removeMessage: 'You are about to delete a user',
        removeSuccessMessage: 'The user has been deleted successfully',
        removeErrorMessage: 'An error occurred while deleting the user',
        createSuccessMessage: 'The user has been created successfully',
        createErrorMessage: 'An error occurred while creating the user',
        updateSuccessMessage: 'The user has been updated successfully',
        updateErrorMessage: 'An error occurred while updating the user',
      },
    },
    {
      provide: BASE_REDIRECT_URL,
      useValue: ApiSuffixesEnum.USERS,
    },
    BaseCrudApiService<User, UsersSummary>,
    USERS_STORE,
  ],
];
