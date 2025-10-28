import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  templateUrl: 'confirm.template.html',
  styleUrl: './confirm.style.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
})
export class ConfirmDialog {
  readonly title = inject<string>(MAT_DIALOG_DATA);
}
