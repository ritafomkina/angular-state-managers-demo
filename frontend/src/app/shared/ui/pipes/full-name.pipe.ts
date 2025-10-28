import { Pipe, PipeTransform } from '@angular/core';

export interface HasName {
  firstName: string;
  lastName: string;
}

@Pipe({
  name: 'fullName',
})
export class FullNamePipe implements PipeTransform {
  transform(entity: HasName | null | undefined): string {
    if (!entity) {
      return '';
    }

    return `${entity.firstName} ${entity.lastName}`.trim();
  }
}
