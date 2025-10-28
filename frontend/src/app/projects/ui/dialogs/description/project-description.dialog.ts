import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, Project, CountriesEnum, ProjectStatusEnum } from '@shared/models';
import { parseDate, shortDate } from '@core/utils';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { COUNTRIES_LIST, PROJECT_STATUSES_LIST } from '@core/constants';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TitleCasePipe } from '@angular/common';

const imports = [
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
  MatAutocompleteModule,
  TitleCasePipe,
];

@Component({
  imports,
  templateUrl: './project-description.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDescriptionDialog extends BaseDialog<Project, Partial<Project>> {
  readonly form = new FormGroup<BaseForm<Project>>({
    title: new FormControl<string | number | undefined | null>(
      this.data?.title,
      Validators.required,
    ),
    status: new FormControl<ProjectStatusEnum>(this.data?.status, Validators.required),
    description: new FormControl<string>(this.data?.description),
    location: new FormControl<CountriesEnum>(this.data?.location),
    startDate: new FormControl<string | null>(parseDate(this.data?.startDate)),
    endDate: new FormControl<string | number | undefined | null>(parseDate(this.data?.endDate)),
  });

  readonly countries = COUNTRIES_LIST;
  readonly statuses = PROJECT_STATUSES_LIST;

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

  protected getFormResult(): Partial<Project> {
    const { startDate: start, endDate: end, location } = this.form.value;
    const startDate = shortDate(start);
    const endDate = shortDate(end);

    return {
      ...this.form.value,
      startDate,
      endDate,
      location,
    } as Partial<Project>;
  }
}
