import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { USERS_STORE } from '../../store/users.store';
import { UserDescriptionComponent } from '@users/ui/components/description/user-description.component';
import { UserContactsComponent } from '@users/ui/components/contacts/user-contacts.component';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';

const imports = [UserDescriptionComponent, UserContactsComponent];

@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly _userStore = inject(USERS_STORE);

  readonly id = input<string>();
  readonly user = this._userStore.currentUser;

  ngOnInit(): void {
    this._userStore.getUser(this.id()!);
  }

  updateDescription(): void {
    this._userStore.updateUser({
      component: UserDescriptionDialog,
      data: this.user()!,
      userId: this.user()!.id,
    });
  }

  updateContacts(): void {
    this._userStore.updateUser({
      component: UserContactsDialog,
      data: this.user()!.contacts,
      userId: this.user()!.id,
    });
  }
}
