import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, User, UserStatusEnum } from '@shared/models';
import { COUNTRIES_LIST, USER_STATUSES_LIST } from '@core/constants';
import { shortDate, parseDate } from '@core/utils';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';

const imports = [
  MatDialogModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatIconModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatSelectModule,
  TitleCasePipe,
];
@Component({
  imports,
  templateUrl: './user-description.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDescriptionDialog extends BaseDialog<User, Partial<User>> {
  readonly countries = COUNTRIES_LIST;
  readonly statuses = USER_STATUSES_LIST;

  readonly form = new FormGroup<BaseForm<User>>({
    firstName: new FormControl<string>(this.data.firstName, [Validators.required]),
    lastName: new FormControl<string>(this.data.lastName, [Validators.required]),
    status: new FormControl<UserStatusEnum>(this.data.status, Validators.required),
    position: new FormControl<string | null>(this.data.position, Validators.required),
    dateOfBirth: new FormControl<string | null>(
      parseDate(this.data.dateOfBirth),
      Validators.required,
    ),
    startDate: new FormControl<string | null>(parseDate(this.data.startDate), Validators.required),
    location: new FormControl<string | null>(this.data.location, Validators.required),
  });

  readonly displayedCountries = toSignal(
    this.form.controls.location!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map((searchTerm) => {
        if (!searchTerm || typeof searchTerm !== 'string') {
          return this.countries;
        }

        const filteredCountries = this.countries?.filter((country) =>
          country.toLowerCase().startsWith(searchTerm.toLowerCase()),
        );

        return filteredCountries;
      }),
    ),
  );

  displayCountry = (country: string): string => country;

  protected getFormResult(): Partial<User> {
    const { dateOfBirth: dob, startDate: dos } = this.form.value;
    const dateOfBirth = shortDate(dob);
    const startDate = shortDate(dos);

    return { ...this.form.value, dateOfBirth, startDate } as Partial<User>;
  }
}
