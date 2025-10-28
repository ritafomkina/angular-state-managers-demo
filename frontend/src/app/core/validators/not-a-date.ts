import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notADate(): ValidatorFn {
  return (control: AbstractControl): Record<string, unknown> | null => {
    if (control.value === null) {
      return { notADate: true };
    }

    return null;
  };
}
