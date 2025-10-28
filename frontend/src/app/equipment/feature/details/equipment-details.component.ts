import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentDescriptionComponent } from '@equipment/ui/components/description/equipment-description.component';
import { EQUIPMENT_STORE } from '@equipment/equipment.providers';
import { EquipmentDescriptionDialog } from '@equipment/ui/dialogs/description/equipment-description.dialog';
import { EquipmentStatusDialog } from '@equipment/ui/dialogs/status/equipment-status.dialog';
import { UserDialog } from '@shared/ui/components/dialogs/user/user.dialog';
import { EquipmentOwnerDialog } from '@equipment/ui/dialogs/owner/equipment-owner.dialog';

const imports = [
  ReactiveFormsModule,
  EquipmentDescriptionComponent,
  MatButtonModule,
  MatIconModule,
];
@Component({
  imports,
  templateUrl: './equipment-details.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EquipmentDetailsComponent implements OnInit {
  private readonly _store = inject(EQUIPMENT_STORE);
  readonly id = input<string>('');
  readonly imageCtrl = new FormControl(null);

  readonly currentEntity = this._store.currentEntity;

  ngOnInit(): void {
    this._store.findOneEntity(this.id()!);
  }

  updateDescription(): void {
    this._store.updateEntity({
      component: EquipmentDescriptionDialog,
      data: this._store.currentEntity()!,
      entityId: this._store.currentEntity()!.id,
    });
  }

  updateStatus(): void {
    this._store.updateEntity({
      component: EquipmentStatusDialog,
      data: this._store.currentEntity()!.status,
      entityId: this._store.currentEntity()!.id,
    });
  }

  updateOwner(): void {
    this._store.updateEntity({
      component: EquipmentOwnerDialog,
      data: this._store.currentEntity()!.owner,
      entityId: this._store.currentEntity()!.id,
    });
  }

  deleteEquipment(): void {
    this._store.deleteEntity(this.id()!);
  }
}
