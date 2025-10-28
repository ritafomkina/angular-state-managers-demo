import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseForm, Project, ProjectCategoriesEnum } from '@shared/models';
import { PROJECT_CATEGORIES_LIST } from '@core/constants';
import { BaseDialog } from '@core/abstract';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TitleCasePipe } from '@angular/common';

const imports = [
  MatDialogModule,
  MatSelectModule,
  ReactiveFormsModule,
  MatButtonModule,
  TitleCasePipe,
];
@Component({
  imports,
  selector: 'app-project-categories',
  templateUrl: './project-categories.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCategoriesDialog extends BaseDialog<
  ProjectCategoriesEnum[],
  { categories: ProjectCategoriesEnum[] }
> {
  readonly categories = PROJECT_CATEGORIES_LIST;

  readonly form = new FormGroup<BaseForm<Project>>({
    categories: new FormControl<ProjectCategoriesEnum[] | null>(this.data),
  });

  protected getFormResult(): { categories: ProjectCategoriesEnum[] } {
    return { categories: this.form.controls.categories?.value as ProjectCategoriesEnum[] };
  }
}
