import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Base class for dialog components to reduce boilerplate
 * @template TData - The type of data passed to the dialog
 * @template TResult - The type of data returned from the dialog (defaults to TData)
 */
export abstract class BaseDialog<TData, TResult = TData> {
  protected readonly dialogRef = inject<MatDialogRef<unknown>>(MatDialogRef);
  protected readonly data = inject<TData>(MAT_DIALOG_DATA);

  abstract readonly form: FormGroup;

  /**
   * Submits the form and closes the dialog with the result
   */
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const result = this.getFormResult();
    this.dialogRef.close(result);
  }

  /**
   * Override this method to customize the result returned from the form
   */
  protected abstract getFormResult(): TResult;

  /**
   * Cancels and closes the dialog without returning data
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
