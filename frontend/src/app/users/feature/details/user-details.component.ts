import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDescriptionComponent } from '@users/ui/components/description/user-description.component';
import { UserContactsComponent } from '@users/ui/components/contacts/user-contacts.component';
import { USERS_STORE } from '@users/users.providers';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';

const imports = [ReactiveFormsModule, UserDescriptionComponent, UserContactsComponent];

@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly _store = inject(USERS_STORE);

  readonly id = input<string>();
  readonly currentEntity = this._store.currentEntity;

  ngOnInit(): void {
    this._store.findOneEntity(this.id()!);
  }

  updateDescription(): void {
    this._store.updateEntity({
      component: UserDescriptionDialog,
      data: this._store.currentEntity()!,
      entityId: this._store.currentEntity()!.id,
    });
  }

  updateContacts(): void {
    this._store.updateEntity({
      component: UserContactsDialog,
      data: this._store.currentEntity()!.contacts,
      entityId: this._store.currentEntity()!.id,
    });
  }
}
