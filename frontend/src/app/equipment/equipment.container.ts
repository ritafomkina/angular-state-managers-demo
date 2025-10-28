import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EQUIPMENT_PROVIDERS } from './equipment.providers';

@Component({
  imports: [RouterOutlet],
  providers: [EQUIPMENT_PROVIDERS],
  template: ` <router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EquipmentContainer {}
