import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes } from './app.routes';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxsModule } from '@ngxs/store';
import { UsersState } from './users/state/users.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(NgxsModule.forRoot([UsersState])),
  ],
};
