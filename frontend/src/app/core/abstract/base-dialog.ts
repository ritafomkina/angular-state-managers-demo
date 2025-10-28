import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export abstract class BaseDialog<TData, TResult = TData> {
  protected readonly dialogRef =
    inject<MatDialogRef<BaseDialog<TData, TResult>, TResult>>(MatDialogRef);
  protected readonly data = inject<TData>(MAT_DIALOG_DATA);

  abstract readonly form: FormGroup;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const result = this.getFormResult();
    this.dialogRef.close(result);
  }

  protected abstract getFormResult(): TResult;

  cancel(): void {
    this.dialogRef.close();
  }
}
