import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseDialog } from '@core/abstract';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const imports = [MatDialogModule, MatInputModule, ReactiveFormsModule, MatButtonModule];
@Component({
  imports,
  templateUrl: './projects-create.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCreateDialog extends BaseDialog<null, { title: string }> {
  readonly form = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  protected getFormResult(): { title: string } {
    return { title: this.form.controls.title?.value || '' };
  }
}
