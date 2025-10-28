import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ChipsColorDirective, FullNamePipe, FiltersComponent } from '@shared/ui';
import { EquipmentStatusEnum } from '@shared/models';
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

  readonly list = this._store.paginatedEntities;
  readonly filters = this._store.filters;

  filterChange(filter: string): void {
    this._store.filterChange(filter);
  }

  createEquipment(): void {
    this._store.createEntity(EquipmentCreateDialog);
  }
}
