import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { notADate } from '@core/validators';
import { BaseForm, User, Vacation } from '@shared/models/interfaces';
import { parseDate, shortDate } from '@core/utils';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FullNamePipe, UserSearchControlComponent } from '@shared/ui';
import { VacationTypeEnum } from '@shared/models';
import { VACATION_TYPES_LIST } from '@core/constants';
import { TitleCasePipe } from '@angular/common';

const imports = [
  MatDialogModule,
  ReactiveFormsModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
  MatButtonModule,
  UserSearchControlComponent,
  TitleCasePipe,
];
@Component({
  imports,
  templateUrl: './vacations-create.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VacationsCreateDialog extends BaseDialog<
  Vacation | null,
  Partial<Vacation> & { userId: string; startDate: string; endDate: string; type: VacationTypeEnum }
> {
  readonly form = new FormGroup<BaseForm<Vacation>>({
    type: new FormControl<VacationTypeEnum>(
      this.data?.type || VacationTypeEnum.Vacation,
      Validators.required,
    ),
    startDate: new FormControl<string | number | undefined | null>(
      parseDate(this.data?.startDate),
      [Validators.required, notADate()],
    ),
    endDate: new FormControl<string | number | undefined | null>(parseDate(this.data?.endDate), [
      Validators.required,
      notADate(),
    ]),
  });

  readonly minDate = new Date();

  readonly isDisabledUserCtrl = computed(() => !!this.data?.user);

  readonly types = VACATION_TYPES_LIST;
  readonly user = this.data?.user;

  displayUser(user: User): string {
    const fullNamePipe = inject(FullNamePipe);
    return user ? fullNamePipe.transform(user) : '';
  }

  protected getFormResult(): Partial<Vacation> & {
    userId: string;
    startDate: string;
    endDate: string;
    type: VacationTypeEnum;
  } {
    const { user, startDate: start, endDate: end, type } = this.form.value;
    const startDate = shortDate(start);
    const endDate = shortDate(end);
    const userId = user?.id || this.data?.user.id;

    return {
      userId,
      startDate,
      endDate,
      type,
    } as Partial<Vacation> & {
      userId: string;
      startDate: string;
      endDate: string;
      type: VacationTypeEnum;
    };
  }
}
