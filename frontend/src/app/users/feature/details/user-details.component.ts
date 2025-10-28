import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '@users/services/users.service';
import { UserContactsComponent } from '@users/ui/components/contacts/user-contacts.component';
import { UserDescriptionComponent } from '@users/ui/components/description/user-description.component';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

const imports = [UserDescriptionComponent, UserContactsComponent];
@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly _userService = inject(UsersService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly id = input<string>();
  readonly user = toSignal(this._userService.getUser(), { initialValue: null });

  ngOnInit(): void {
    this._userService.setUserId(this.id()!);
  }

  updateDescription(): void {
    this._userService
      .updateUser(UserDescriptionDialog, this.user()!, this.user()!.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  updateContacts(): void {
    this._userService
      .updateUser(UserContactsDialog, this.user()!.contacts, this.user()!.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
