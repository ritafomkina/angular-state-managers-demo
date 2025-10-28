import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { notADate } from '@core/validators';
import { BaseForm, Equipment } from '@shared/models';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseDialog } from '@core/abstract';

const imports = [
  ReactiveFormsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
];
@Component({
  imports,
  templateUrl: './equipment-create.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentCreateDialog extends BaseDialog<
  null,
  { title: string; description: string; receiptTimestamp: string }
> {
  readonly form = new FormGroup<BaseForm<Equipment>>({
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    receiptTimestamp: new FormControl<string>('', [Validators.required, notADate()]),
  });

  readonly maxDate = new Date();

  protected getFormResult(): { title: string; description: string; receiptTimestamp: string } {
    const { title, description, receiptTimestamp } = this.form.value;
    return { title, description, receiptTimestamp };
  }
}
