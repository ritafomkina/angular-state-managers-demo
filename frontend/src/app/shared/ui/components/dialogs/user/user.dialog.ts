import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '@shared/models/interfaces';
import { UserSearchControlComponent, UserSearchStore } from '@shared/ui/components/user-search';

const imports = [UserSearchControlComponent, MatDialogModule, ReactiveFormsModule, MatButtonModule];
@Component({
  imports,
  templateUrl: './user.template.html',
  providers: [UserSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialog {
  private readonly _dialogRef = inject(MatDialogRef);

  readonly form = new FormGroup({});

  submit(): void {
    const { id } = this.form.get('user')?.value as unknown as User;

    this._dialogRef.close(id);
  }
}
