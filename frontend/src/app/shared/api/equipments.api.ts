import { Injectable } from '@angular/core';

import { BaseCrudApiService } from './base-crud-api.service';
import { Equipment, EquipmentSummary } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class EquipmentsApiService extends BaseCrudApiService<Equipment, EquipmentSummary> {
  // some other method
}
