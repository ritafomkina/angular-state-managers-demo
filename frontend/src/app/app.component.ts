import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAVIGATION_LINKS } from '@core/constants';
import { ProgressService } from '@core/services';

@Component({
  imports: [RouterOutlet, MatProgressBarModule, MatDividerModule, RouterLinkActive, RouterLink],
  selector: 'app-root',
  templateUrl: './app.template.html',
  styleUrl: './app.styles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly isLoading = inject(ProgressService).isLoading;

  readonly navlinks = NAVIGATION_LINKS;
}
