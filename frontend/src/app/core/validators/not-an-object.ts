import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notAnObject(): ValidatorFn {
  return (control: AbstractControl): Record<string, unknown> | null => {
    const isString = control.value && typeof control.value === 'string';

    if (isString) {
      return { notAnObject: true };
    }

    return null;
  };
}
