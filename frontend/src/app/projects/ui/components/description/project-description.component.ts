import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ChipsColorDirective } from '@shared/ui';
import { Project } from '@shared/models';
import { MatIconModule } from '@angular/material/icon';

const imports = [
  MatButtonModule,
  MatIconModule,
  DatePipe,
  MatChipsModule,
  TitleCasePipe,
  ChipsColorDirective,
];

@Component({
  imports,
  selector: 'app-project-description',
  templateUrl: './project-description.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDescriptionComponent {
  readonly project = input<Project | null>();
  readonly edit = output<void>();
  readonly editCategories = output<void>();
}
