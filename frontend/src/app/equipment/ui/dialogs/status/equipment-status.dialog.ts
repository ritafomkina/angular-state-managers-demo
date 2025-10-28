import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, EquipmentStatusEnum } from '@shared/models';
import { EQUIPMENT_STATUSES_LIST } from '@core/constants';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';

const imports = [
  ReactiveFormsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  TitleCasePipe,
];
@Component({
  imports,
  templateUrl: './equipment-status.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentStatusDialog extends BaseDialog<
  EquipmentStatusEnum,
  { status: EquipmentStatusEnum }
> {
  readonly statuses = EQUIPMENT_STATUSES_LIST;

  readonly form = new FormGroup<BaseForm<{ status: EquipmentStatusEnum }>>({
    status: new FormControl<EquipmentStatusEnum>(this.data!, Validators.required),
  });

  protected getFormResult(): { status: EquipmentStatusEnum } {
    return { status: this.form.controls.status?.value as EquipmentStatusEnum };
  }
}
