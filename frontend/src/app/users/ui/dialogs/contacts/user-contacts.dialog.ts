import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BaseForm, Contacts } from '@shared/models/interfaces';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const imports = [
  MatDialogModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
];

@Component({
  imports,
  templateUrl: './user-contacts.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContactsDialog extends BaseDialog<Contacts, { contacts: Partial<Contacts> }> {
  readonly form = new FormGroup<BaseForm<Contacts>>({
    phone: new FormControl<string>(this.data?.phone, Validators.required),
    email: new FormControl<string>(this.data?.email, [Validators.required, Validators.email]),
  });

  protected getFormResult(): { contacts: Partial<Contacts> } {
    const { phone, email } = this.form.value;
    return { contacts: { phone, email } };
  }
}
