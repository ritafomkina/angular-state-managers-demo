import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Contacts } from '@shared/models';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

const imports = [MatButtonModule, MatChipsModule];
@Component({
  imports,
  selector: 'app-user-contacts',
  templateUrl: './user-contacts.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContactsComponent {
  readonly contacts = input<Contacts | null>();
  readonly edit = output<void>();
}
