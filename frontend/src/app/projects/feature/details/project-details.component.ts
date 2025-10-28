import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';

import { PROJECTS_STORE } from '@projects/projects.providers';
import { ProjectDescriptionDialog } from '@projects/ui/dialogs/description/project-description.dialog';
import { ProjectCategoriesDialog } from '@projects/ui/dialogs/categories/project-categories.dialog';
import { ProjectDescriptionComponent } from '@projects/ui/components/description/project-description.component';

const imports = [ProjectDescriptionComponent];
@Component({
  imports,
  templateUrl: './project-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectDetailsComponent implements OnInit {
  private readonly _store = inject(PROJECTS_STORE);
  readonly id = input<string>();

  readonly currentEntity = this._store.currentEntity;

  ngOnInit(): void {
    this._store.findOneEntity(this.id()!);
  }

  updateDescription(): void {
    this._store.updateEntity({
      component: ProjectDescriptionDialog,
      data: this._store.currentEntity()!,
      entityId: this._store.currentEntity()!.id,
    });
  }

  updateCategories(): void {
    this._store.updateEntity({
      component: ProjectCategoriesDialog,
      data: this._store.currentEntity()!.categories,
      entityId: this._store.currentEntity()!.id,
    });
  }
}
