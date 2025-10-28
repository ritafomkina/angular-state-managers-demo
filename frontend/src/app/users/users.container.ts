import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  providers: [UsersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersContainer {}
