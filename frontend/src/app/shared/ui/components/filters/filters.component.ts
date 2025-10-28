import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { BaseSummary } from 'src/app/shared/models';

@Component({
  imports: [KeyValuePipe, MatRippleModule, TitleCasePipe],
  selector: 'app-filters',
  templateUrl: './filters.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
  readonly filterChange = output<string>();

  readonly filters = input<BaseSummary | null>({ total: 0 });
}
