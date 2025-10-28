import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { USERS_PROVIDERS } from './users.providers';

@Component({
  imports: [RouterOutlet],
  providers: [USERS_PROVIDERS],
  template: ` <router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersContainer {}
