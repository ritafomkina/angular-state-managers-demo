import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, Equipment } from '@shared/models';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const imports = [
  ReactiveFormsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
];
@Component({
  imports,
  templateUrl: './equipment-description.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentDescriptionDialog extends BaseDialog<Equipment, Partial<Equipment>> {
  readonly form = new FormGroup<BaseForm<Partial<Equipment>>>({
    title: new FormControl<string>(this.data?.title, Validators.required),
    description: new FormControl<string>(this.data?.description, Validators.required),
  });

  protected getFormResult(): Partial<Equipment> {
    return this.form.value as Partial<Equipment>;
  }
}
