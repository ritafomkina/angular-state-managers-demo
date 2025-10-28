import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from 'src/app/shared/models';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { ChipsColorDirective } from 'src/app/shared/ui';

const imports = [
  MatButtonModule,
  DatePipe,
  RouterLink,
  MatChipsModule,
  ChipsColorDirective,
  TitleCasePipe,
];
@Component({
  imports,
  selector: 'app-user-description',
  templateUrl: './user-description.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDescriptionComponent {
  readonly user = input<User | null>();
  readonly edit = output<void>();
}
