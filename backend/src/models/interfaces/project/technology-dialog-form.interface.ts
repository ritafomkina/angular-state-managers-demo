import { ProjectTechnologiesEnum } from '@shared/models/enums';
import { Technologies } from '@shared/models/interfaces';
import { Observable } from 'rxjs';

export interface TechnologyDialogForm {
  type?: ProjectTechnologiesEnum | void;
  techs: Technologies | void;
  list$: Observable<string[]>;
}
