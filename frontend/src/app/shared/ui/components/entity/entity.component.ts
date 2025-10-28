import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.template.html',
  styleUrl: './entity.style.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityComponent {
  readonly noAvatar = input(false, { transform: (value) => booleanAttribute(value) });
  readonly avatarUrl = input('', {
    transform: (url) => url || '/assets/user-placeholder.png',
  });

  readonly title = input<string>();
  readonly description = input<string>();
}
