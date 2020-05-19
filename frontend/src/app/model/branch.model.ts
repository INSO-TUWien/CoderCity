import { Commit } from './commit.model';
import { Md5 } from 'ts-md5';
export class Branch {
    name: string;
    commit: Commit;

    static hashCode(branch: Branch): string {
        return Md5.hashStr(branch.name) + '';
    }
}
