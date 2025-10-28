import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { UserContactsComponent } from '@users/ui/components/contacts/user-contacts.component';
import { UserDescriptionComponent } from '@users/ui/components/description/user-description.component';
import * as UsersActions from '@users/store/users.actions';
import * as UsersSelectors from '@users/store/users.selectors';
import { AppState } from '@users/store/app.state';

const imports = [UserDescriptionComponent, UserContactsComponent];

@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly store = inject(Store<AppState>);

  readonly id = input<string>();
  readonly user = toSignal(this.store.select(UsersSelectors.selectSelectedUser));

  ngOnInit(): void {
     this.store.dispatch(UsersActions.loadUser({ id: this.id()! }));
  }

  updateDescription(): void {
    this.store.dispatch(UsersActions.updateUserDescription({ user: this.user()! }));
  }

  updateContacts(): void {
    this.store.dispatch(UsersActions.updateUserContacts({ user: this.user()! }));
  }
}
