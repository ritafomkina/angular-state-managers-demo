import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BaseTable } from '@core/abstract';
import { TABLE_COLUMNS } from '@core/constants';
import { VacationStatusEnum } from '@shared/models';
import { Vacation } from '@shared/models/interfaces';
import { FullNamePipe, ChipsColorDirective, EntityComponent, FiltersComponent } from '@shared/ui';
import { VacationsCreateDialog } from '@vacations/ui/create/vacations-create.dialog';
import { VacationsStatusDialog } from '@vacations/ui/status/vacations-status.dialog';
import { VACATIONS_PROVIDERS, VACATIONS_STORE } from '@vacations/vacations.providers';

const imports = [
  ReactiveFormsModule,
  EntityComponent,
  FullNamePipe,
  MatTableModule,
  MatSortModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatChipsModule,
  ChipsColorDirective,
  DatePipe,
  TitleCasePipe,
  FiltersComponent,
];
@Component({
  imports,
  templateUrl: './vacations-table.template.html',
  providers: [DatePipe, VACATIONS_PROVIDERS],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VacationsTableComponent extends BaseTable<Vacation> implements OnInit {
  private readonly _store = inject(VACATIONS_STORE);

  readonly list = this._store.paginatedEntities;
  readonly filters = this._store.filters;

  readonly columns = TABLE_COLUMNS.vacation;
  readonly status = VacationStatusEnum;

  ngOnInit(): void {
    this._store.searchEntities(this.queryParams);
  }

  createVacation(): void {
    this._store.createEntity(VacationsCreateDialog);
  }

  editVacation(vacation: Vacation): void {
    this._store.updateEntity({
      component: VacationsCreateDialog,
      data: vacation,
      entityId: vacation.id,
    });
  }

  approveVacation(id: string): void {
    this._store.updateEntity({
      component: VacationsStatusDialog,
      data: {
        status: VacationStatusEnum.Approved,
        title: 'You are about to approve this request',
      },
      entityId: id,
    });
  }

  rejectVacation(id: string): void {
    this._store.updateEntity({
      component: VacationsStatusDialog,
      data: { status: VacationStatusEnum.Rejected, title: 'You are about to reject this request' },
      entityId: id,
    });
  }

  deleteVacation(id: string): void {
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
