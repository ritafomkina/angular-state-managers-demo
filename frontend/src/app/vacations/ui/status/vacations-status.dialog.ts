import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@core/abstract';
import { Vacation, BaseForm, VacationStatusEnum } from '@shared/models';

const imports = [MatIconModule, MatDialogModule, MatButtonModule, ReactiveFormsModule];

@Component({
  imports,
  styleUrl: './vacations-status.style.scss',
  templateUrl: './vacations-status.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacationsStatusDialog extends BaseDialog<
  { status: VacationStatusEnum; title: string },
  Partial<Vacation>
> {
  readonly form = new FormGroup<BaseForm<Vacation>>({
    status: new FormControl<VacationStatusEnum>(
      this.data?.status || VacationStatusEnum.Request,
      Validators.required,
    ),
  });

  protected getFormResult(): Partial<Vacation> {
    const { status } = this.form.value;
    return { status };
  }
}
