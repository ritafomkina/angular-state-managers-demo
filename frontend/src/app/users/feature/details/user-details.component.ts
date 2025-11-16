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
import { filter, switchMap, tap } from 'rxjs';
import { UsersApiService } from 'src/app/shared/services';
import { UsersQuery } from '../../state/users.query';
import { UsersStore } from '../../state/users.store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services';
import { ComponentType } from '@angular/cdk/overlay';

const imports = [UserDescriptionComponent, UserContactsComponent];
@Component({
  imports,
  templateUrl: './user-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserDetailsComponent implements OnInit {
  private readonly _usersApi = inject(UsersApiService);
  private readonly _usersStore = inject(UsersStore);
  private readonly _usersQuery = inject(UsersQuery);
  private readonly _dialog = inject(MatDialog);
  private readonly _snackbarService = inject(SnackbarService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly id = input<string>();
  readonly user = toSignal(this._usersQuery.selectUser(), { initialValue: null });

  ngOnInit(): void {
    this.loadUser(this.id()!);
  }

  updateDescription(): void {
    this.updateUser(UserDescriptionDialog, this.user()!, this.user()!.id);
  }

  updateContacts(): void {
    this.updateUser(UserContactsDialog, this.user()!.contacts, this.user()!.id);
  }

  private loadUser(id: string): void {
    this._usersApi
      .findOne(id)
      .pipe(
        tap({
          next: (user) => this._usersStore.update({ user }),
          error: () => this._snackbarService.open('Error loading user', 'error'),
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private updateUser<TData>(
    component: ComponentType<any>,
    data: TData,
    userId: string,
  ): void {
    const config: MatDialogConfig = { width: '600px', data };
    this._dialog
      .open(component, config)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((user) =>
          this._usersApi.update(userId, user).pipe(
            tap({
              next: () => {
                this._snackbarService.open('User updated successfully', 'success');
                this.loadUser(userId);
              },
              error: () => this._snackbarService.open('Error updating user', 'error'),
            }),
          ),
        ),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
