import { Provider } from '@angular/core';
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withBaseMethods, BASE_MESSAGES, BASE_REDIRECT_URL } from '@shared/store';
import { ApiSuffixesEnum, Project, ProjectsSummary } from '@shared/models';
import { BaseCrudApiService, BASE_API_SUFFIX } from '@shared/api';

export const PROJECTS_STORE = signalStore(withEntities<Project>(), withBaseMethods());

export const PROJECTS_PROVIDERS: Provider[] = [
  [
    {
      provide: BASE_API_SUFFIX,
      useValue: ApiSuffixesEnum.PROJECTS,
    },
    {
      provide: BASE_MESSAGES,
      useValue: {
        removeMessage: 'You are about to delete a project',
        removeSuccessMessage: 'The project has been deleted successfully',
        removeErrorMessage: 'An error occurred while deleting the project',
        createSuccessMessage: 'The project has been created successfully',
        createErrorMessage: 'An error occurred while creating the project',
        updateSuccessMessage: 'The project has been updated successfully',
        updateErrorMessage: 'An error occurred while updating the project',
      },
    },
    {
      provide: BASE_REDIRECT_URL,
      useValue: ApiSuffixesEnum.PROJECTS,
    },
    BaseCrudApiService<Project, ProjectsSummary>,
    PROJECTS_STORE,
  ],
];
