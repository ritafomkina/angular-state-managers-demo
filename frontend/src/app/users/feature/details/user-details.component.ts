import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
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
export default class UserDetailsComponent {
  private readonly store = inject(Store<AppState>);

  readonly id = input<string>();

  readonly user = toSignal(this.store.select(UsersSelectors.selectSelectedUser));

  constructor() {
    effect(() => {
      const userId = this.id();
      if (userId) {
        this.store.dispatch(UsersActions.loadUser({ id: userId }));
      }
    });
  }

  updateDescription(): void {
    const user = this.user();
    if (user) {
      this.store.dispatch(UsersActions.updateUserDescription({ user }));
    }
  }

  updateContacts(): void {
    const user = this.user();
    if (user) {
      this.store.dispatch(UsersActions.updateUserContacts({ user }));
    }
  }
}
