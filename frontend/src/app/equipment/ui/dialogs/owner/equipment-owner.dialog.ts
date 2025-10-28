import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, Equipment, User } from '@shared/models';
import { BaseDialog } from '@core/abstract';
import { MatButtonModule } from '@angular/material/button';
import { UserSearchControlComponent } from '@shared/ui';

const imports = [ReactiveFormsModule, MatDialogModule, MatButtonModule, UserSearchControlComponent];
@Component({
  imports,
  templateUrl: './equipment-owner.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentOwnerDialog extends BaseDialog<User | null, { ownerId: string }> {
  readonly form = new FormGroup<BaseForm<Equipment>>({
    owner: new FormControl<User | null>(this.data, Validators.required),
  });

  protected getFormResult(): { ownerId: string } {
    return { ownerId: this.form.controls.owner?.value?.id ?? '' };
  }
}
