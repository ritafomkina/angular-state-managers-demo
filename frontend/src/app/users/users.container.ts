import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { USERS_STORE } from './store/users.store';

@Component({
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  providers: [USERS_STORE],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersContainer {}
