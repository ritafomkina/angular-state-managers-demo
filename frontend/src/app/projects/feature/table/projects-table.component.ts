import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BaseTable } from '@core/abstract';
import { Project } from '@shared/models';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ChipsColorDirective, EntityComponent, FiltersComponent } from '@shared/ui';
import { TABLE_COLUMNS } from '@core/constants';
import { PROJECTS_STORE } from '@projects/projects.providers';
import { ProjectsCreateDialog } from '@projects/ui/dialogs/create/projects-create.dialog';

const imports = [
  RouterLink,
  EntityComponent,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatChipsModule,
  ChipsColorDirective,
  TitleCasePipe,
  FiltersComponent,
  DatePipe,
];

@Component({
  imports,
  templateUrl: './projects-table.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectsTableComponent extends BaseTable<Project> implements OnInit {
  private readonly _store = inject(PROJECTS_STORE);

  readonly list = this._store.paginatedEntities;
  readonly filters = this._store.filters;

  readonly columns = TABLE_COLUMNS.project;

  ngOnInit(): void {
    this._store.searchEntities(this.queryParams);
  }

  createProject(): void {
    this._store.createEntity(ProjectsCreateDialog);
  }

  deleteProject(id: string): void {
    this._store.deleteEntity(id);
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._store.searchEntities(this.queryParams);
  }

  sortChange(sort: Sort): void {
    if (!sort) {
      this._store.searchEntities(this.queryParams);

      return;
    }

    const direction = sort.direction === 'asc' ? '' : '-';

    this.queryParams.sort = `${direction}${sort.active}`;

    this._store.searchEntities(this.queryParams);
  }

  pageChange(page: PageEvent): void {
    this.queryParams.current = ++page.pageIndex;
    this.queryParams.size = page.pageSize;

    this._store.searchEntities(this.queryParams);
  }
}
