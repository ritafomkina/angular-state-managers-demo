import { InjectionToken } from '@angular/core';
import { BaseMessages, ApiSuffixesEnum } from '@shared/models';

export const BASE_MESSAGES = new InjectionToken<BaseMessages>(
  'An abstraction to provide messages for the base store',
);

export const BASE_REDIRECT_URL = new InjectionToken<ApiSuffixesEnum>('BASE_STORE_REDIRECT_URL');
