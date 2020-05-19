import { Commit } from 'src/app/model/commit.model';
import { Branch } from 'src/app/model/branch.model';
import { Author } from 'src/app/model/author.model';

export class ProjectData {
    commits: Commit[];
    branches: Branch[];
    authors: Author[];
}