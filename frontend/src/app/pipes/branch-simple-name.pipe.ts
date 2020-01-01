import { Pipe, PipeTransform } from '@angular/core';
import { Branch } from '../timeline/gitgraph/datastructure/branch.model';

const REFERENCE_BRANCH_REPLACE_REGEX = new RegExp('refs\/|heads\/|remotes\/', 'g');

@Pipe({
  name: 'branchSimpleName'
})
export class BranchSimpleNamePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(REFERENCE_BRANCH_REPLACE_REGEX, '');
  }

}
