import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authorInitials'
})
export class AuthorInitialsPipe implements PipeTransform {

  transform(name: string, ...args: any[]): string {
    return name.split(' ').map(n => n[0]).join('');
  }

}
