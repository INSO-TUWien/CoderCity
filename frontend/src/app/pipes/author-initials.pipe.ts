import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authorInitials'
})
export class AuthorInitialsPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return value.substr(0, 2);
  }

}
