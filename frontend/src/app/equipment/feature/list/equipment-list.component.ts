import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ChipsColorDirective, FullNamePipe, FiltersComponent } from '@shared/ui';
import { EquipmentStatusEnum, QueryParameters } from '@shared/models';
import { EQUIPMENT_STORE } from '@equipment/equipment.providers';
import { EquipmentCreateDialog } from '@equipment/ui/dialogs/create/equipment-create.dialog';
import { DatePipe } from '@angular/common';

const imports = [
  RouterLink,
  MatButtonModule,
  ChipsColorDirective,
  MatChipsModule,
  FiltersComponent,
  FullNamePipe,
  DatePipe,
];

@Component({
  imports,
  templateUrl: './equipment-list.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EquipmentListComponent {
  private readonly _store = inject(EQUIPMENT_STORE);
  readonly statuses = EquipmentStatusEnum;
  queryParams: QueryParameters = { size: 20, current: 1 };

  readonly list = this._store.paginatedEntities;
  readonly filters = this._store.filters;

  ngOnInit(): void {
    this._store.searchEntities(this.queryParams);
  }

  filterChange(filter: string): void {
    this.queryParams = { ...this.queryParams, filter };
    this._store.searchEntities(this.queryParams);
  }

  createEquipment(): void {
    this._store.createEntity(EquipmentCreateDialog);
  }
}
