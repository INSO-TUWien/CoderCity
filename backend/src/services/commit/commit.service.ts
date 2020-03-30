import { Injectable, Logger } from '@nestjs/common';
import { GitService } from '../git/git.service';
import { File } from "src/model/file.model";
import { Directory } from 'src/model/directory.model';

@Injectable()
export class CommitService {
    private readonly logger = new Logger(CommitService.name);

    constructor(private gitService: GitService) {
    }

    getFilesOfCommit(commitId: string): Promise<File[]> {
        return this.gitService.repo.getFilesForCommit(commitId);
    }

    getFilesWithDirectoriesOfCommit(commitId: string): Promise<Directory> {
        return this.gitService.repo.getFilesWithDirectoriesOfCommit(commitId);
    }

}
