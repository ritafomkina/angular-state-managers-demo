import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PROJECTS_PROVIDERS } from './projects.providers';

@Component({
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  providers: [PROJECTS_PROVIDERS],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsContainer {}
