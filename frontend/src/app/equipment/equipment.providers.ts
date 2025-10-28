import { Provider } from '@angular/core';
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withBaseMethods, BASE_MESSAGES, BASE_REDIRECT_URL } from '@shared/store';
import { ApiSuffixesEnum, Equipment, EquipmentSummary } from '@shared/models';
import { BaseCrudApiService, BASE_API_SUFFIX } from '@shared/api';

export const EQUIPMENT_STORE = signalStore(withEntities<Equipment>(), withBaseMethods());

export const EQUIPMENT_PROVIDERS: Provider[] = [
  [
    {
      provide: BASE_API_SUFFIX,
      useValue: ApiSuffixesEnum.EQUIPMENT,
    },
    {
      provide: BASE_MESSAGES,
      useValue: {
        removeMessage: 'You are about to delete an equipment',
        removeSuccessMessage: 'The equipment has been deleted successfully',
        removeErrorMessage: 'An error occurred while deleting the equipment',
        createSuccessMessage: 'The equipment has been created successfully',
        createErrorMessage: 'An error occurred while creating the equipment',
        updateSuccessMessage: 'The equipment has been updated successfully',
        updateErrorMessage: 'An error occurred while updating the equipment',
      },
    },
    {
      provide: BASE_REDIRECT_URL,
      useValue: ApiSuffixesEnum.EQUIPMENT,
    },
    BaseCrudApiService<Equipment, EquipmentSummary>,
    EQUIPMENT_STORE,
  ],
];
