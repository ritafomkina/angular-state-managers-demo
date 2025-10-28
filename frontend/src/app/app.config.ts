import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes } from './app.routes';
import { MatNativeDateModule } from '@angular/material/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from '@users/store/users.reducer';
import { UsersEffects } from '@users/store/users.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    provideStore({ users: usersReducer }),
    provideEffects([UsersEffects]),
  ],
};
