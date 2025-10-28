import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import {
  EquipmentStatusEnum,
  ProjectStatusEnum,
  ProjectTechnologiesEnum,
  ProjectTypeEnum,
  StatusColorEnum,
  UserStatusEnum,
  VacationStatusEnum,
  VacationTypeEnum,
} from '@shared/models/enums';

type Status =
  | UserStatusEnum
  | ProjectStatusEnum
  | ProjectTypeEnum
  | ProjectTechnologiesEnum
  | string
  | null
  | undefined;

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
        case ProjectStatusEnum.Active:
        case ProjectTechnologiesEnum.QA:
        case ProjectTechnologiesEnum.Other:
        case UserStatusEnum.Works:
        case VacationStatusEnum.Approved:
        case EquipmentStatusEnum.Available:
          this._setBackgroundColor(StatusColorEnum.Green);
          break;

        case ProjectStatusEnum.Completed:
        case UserStatusEnum.Sick:
        case VacationTypeEnum.SickLeave:
        case VacationStatusEnum.Rejected:
          this._setBackgroundColor(StatusColorEnum.Red);
          break;

        case VacationStatusEnum.Expired:
          this._setBackgroundColor(StatusColorEnum.Gray);
          break;

        case ProjectTechnologiesEnum.Backend:
        case ProjectTechnologiesEnum.Database:
        case ProjectStatusEnum.Support:
        case VacationStatusEnum.Request:
        case UserStatusEnum.Vacation:
        case EquipmentStatusEnum.Occupied:
        case VacationTypeEnum.Vacation:
          this._setBackgroundColor(StatusColorEnum.Yellow);
          break;

        case ProjectTypeEnum.FE:
        case ProjectTechnologiesEnum.Frontend:
        case ProjectTypeEnum.Web:
        case UserStatusEnum.DayOff:
        case VacationTypeEnum.DayOff:
          this._setBackgroundColor(StatusColorEnum.Blue);
          break;

        case ProjectTypeEnum.BE:
        case ProjectTechnologiesEnum.Mobile:
        case ProjectTechnologiesEnum.Manager:
        case ProjectTypeEnum.Mob:
          this._setBackgroundColor(StatusColorEnum.Purple);
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
