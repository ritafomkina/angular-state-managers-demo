import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { EquipmentStatusEnum, Equipment } from '@shared/models';
import { ChipsColorDirective, FullNamePipe, UserSearchStore } from '@shared/ui';

const imports = [
  RouterLink,
  MatIconModule,
  ChipsColorDirective,
  MatChipsModule,
  TitleCasePipe,
  DatePipe,
  MatButtonModule,
  FullNamePipe,
];
@Component({
  imports,
  selector: 'app-equipment-description',
  templateUrl: './equipment-description.template.html',
  // providers: [UserSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentDescriptionComponent {
  readonly equipment = input.required<Equipment | null>();
  readonly edit = output();
  readonly updateStatus = output();
  readonly statuses = EquipmentStatusEnum;

  readonly changeOwner = output<void>();
}
