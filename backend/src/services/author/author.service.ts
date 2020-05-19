import { Injectable } from '@nestjs/common';
import { GitService } from '../git/git.service';
import { Signature } from 'src/model/signature.model';

@Injectable()
export class AuthorService {
    constructor(private gitService: GitService) {}

    async getAllAuthors(projectId: string): Promise<Signature[]> {
        const authors: Signature[] = [];
        const repo = await this.gitService.getRepoByProjectId(projectId);
        repo.gitModel.commits.forEach((commit) => {
            // Check whether author already is in array
            const authorExists = authors.map((author) =>
                author.name === commit.authorName &&
                author.email === commit.mail
            ).reduce((prev, cur) => prev || cur, false);

            if (!authorExists) {
                authors.push(new Signature(commit.authorName, commit.mail));
            }
        });
        return Array.from(authors.values());
    }
}
