import { Provider } from '@angular/core';
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withBaseMethods, BASE_MESSAGES } from '@shared/store';
import { ApiSuffixesEnum, Vacation } from '@shared/models';
import { BaseCrudApiService, BASE_API_SUFFIX } from '@shared/api';

export const VACATIONS_STORE = signalStore(withEntities<Vacation>(), withBaseMethods());

export const VACATIONS_PROVIDERS: Provider[] = [
  [
    {
      provide: BASE_API_SUFFIX,
      useValue: ApiSuffixesEnum.VACATIONS,
    },
    {
      provide: BASE_MESSAGES,
      useValue: {
        removeMessage: 'You are about to delete a vacation',
        removeSuccessMessage: 'The vacation has been deleted successfully',
        removeErrorMessage: 'An error occurred while deleting the vacation',
        createSuccessMessage: 'The vacation has been created successfully',
        createErrorMessage: 'An error occurred while creating the vacation',
        updateSuccessMessage: 'The vacation has been updated successfully',
        updateErrorMessage: 'An error occurred while updating the vacation',
      },
    },
    BaseCrudApiService,
    VACATIONS_STORE,
  ],
];
