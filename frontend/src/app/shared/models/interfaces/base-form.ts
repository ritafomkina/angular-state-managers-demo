import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type BaseForm<T> = {
  [Key in keyof Partial<T>]: FormControl | FormGroup | FormArray;
};
