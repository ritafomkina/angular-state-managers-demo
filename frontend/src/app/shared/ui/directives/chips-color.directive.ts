import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { StatusColorEnum, UserStatusEnum } from '@shared/models';

type Status = UserStatusEnum | string | null | undefined;

@Directive({
  selector: '[appChipColor]',
})
export class ChipsColorDirective {
  private readonly _elRef: ElementRef = inject(ElementRef);
  private readonly _renderer: Renderer2 = inject(Renderer2);

  readonly appChipColor = input<Status>();

  constructor() {
    effect(() => {
      switch (this.appChipColor()) {
        case UserStatusEnum.Works:
          this._setBackgroundColor(StatusColorEnum.Green);
          break;

        case UserStatusEnum.Sick:
          this._setBackgroundColor(StatusColorEnum.Red);
          break;

        case UserStatusEnum.Vacation:
          this._setBackgroundColor(StatusColorEnum.Yellow);
          break;

        case UserStatusEnum.DayOff:
          this._setBackgroundColor(StatusColorEnum.Blue);
          break;

        default:
          this._setBackgroundColor(StatusColorEnum.Blue);
      }
    });
  }

  private _setBackgroundColor(color: StatusColorEnum | string): void {
    this._renderer.setStyle(this._elRef.nativeElement, 'background-color', color);
    this._renderer.setStyle(this._elRef.nativeElement, 'color', '#fff');
  }
}
