import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, Contacts, User } from '@shared/models/interfaces';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const imports = [MatDialogModule, ReactiveFormsModule, MatInputModule, MatButtonModule];

@Component({
  imports,
  templateUrl: './users-create.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersCreateDialog extends BaseDialog<
  null,
  Partial<User> & { contacts: { email: string } }
> {
  readonly form = new FormGroup<BaseForm<User & Contacts>>({
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  protected getFormResult(): Partial<User> & { contacts: { email: string } } {
    const { email, ...userData } = this.form.value;
    return { ...userData, contacts: { email: email! } } as Partial<User> & {
      contacts: { email: string };
    };
  }
}
