import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserContactsComponent } from '@users/ui/components/contacts/user-contacts.component';
import { UserDescriptionComponent } from '@users/ui/components/description/user-description.component';
import { UserContactsDialog } from '@users/ui/dialogs/contacts/user-contacts.dialog';
import { UserDescriptionDialog } from '@users/ui/dialogs/description/user-description.dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { UsersState } from '../../state/users.state';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import { SetUserId, UpdateUser } from '../../state/users.actions';
import { ComponentType } from '@angular/cdk/overlay';

const imports = [UserDescriptionComponent, UserContactsComponent];
@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly _store = inject(Store);
  private readonly _dialog = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);

  readonly id = input<string>();
  readonly user = toSignal(this._store.select(UsersState.user), { initialValue: null });

  ngOnInit(): void {
    this._store.dispatch(new SetUserId(this.id()!));
  }

  updateDescription(): void {
    this.openAndUpdate(UserDescriptionDialog, this.user()!, this.user()!.id);
  }

  updateContacts(): void {
    this.openAndUpdate(UserContactsDialog, this.user()!.contacts, this.user()!.id);
  }

  private openAndUpdate<TData>(component: ComponentType<any>, data: TData, userId: string): void {
    const config: MatDialogConfig = { width: '600px', data };
    this._dialog
      .open(component, config)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((payload) => this._store.dispatch(new UpdateUser(userId, payload))),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
