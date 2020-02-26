import { Repository as NodeGitRepository, Tree, Blame, Oid } from 'nodegit';
import { Logger } from '@nestjs/common';
import { File } from "src/model/file.model";
import { BlameHunk as BlameHunkModel } from "src/model/blamehunk.model";

export class Repository {

    private readonly logger = new Logger(Repository.name);
    private repository: NodeGitRepository;

    constructor(
        public readonly folderPath: string
    ) {
    }

    async openRepo(): Promise<void> {
        this.repository = await NodeGitRepository.open(this.folderPath);
    }

    isOpen(): boolean {
        return (this.repository != null);
    }

    getRepo(): NodeGitRepository {
        return this.repository;
    }

    async getFilesForCommit(commitId: string): Promise<File[]> {
        /**
         * Walk through all files in current revision.
         * @see https://github.com/nodegit/nodegit/blob/cb4a5309353add160fd55887314ff0bb69427706/examples/walk-tree.js
         */
        const masterCommit = await this.repository.getMasterCommit();
        const filePaths = await this.getAllFilePathsOfCommit(commitId);
        let files = [];
        await Promise.all(filePaths.map(async (filePath) => {
            const file = await this.getFileWithBlameHunks(filePath, masterCommit.sha());
            files.push(file);
        }));
        return files;
    }

    /**
     * Retrieves all files (file paths) of a commit given a commit id.
     * @param commitId
     */
    async getAllFilePathsOfCommit(commitId: string): Promise<string[]> {
        const commit = await this.repository.getCommit(commitId);
        const tree = await commit.getTree();
        const walker = tree.walk();
        const filePaths = [];
        walker.on('entry', (entry: Tree) => {
            filePaths.push(entry.path());
        });
        walker.start();
        return filePaths;
    }

    /**
     * Parses blame hunks for a given file
     * @see https://github.com/nodegit/nodegit/issu es/1264
     * @param filename
     */
    async getFileWithBlameHunks(fileName: string, commitId: string): Promise<File> {
        this.logger.log(`Parsing blame hunks for ${fileName}. Commit: ${commitId}`);
        const blame = await Blame.file(this.repository, fileName, {
            newestCommit: Oid.fromString(commitId)
        });

        // Create file
        const file = new File(fileName);
        for (let i = 0; i < blame.getHunkCount(); i++) {
            const hunk = blame.getHunkByIndex(i);

            const hunkModel = new BlameHunkModel(
                hunk.origStartLineNumber(),
                hunk.origStartLineNumber() + hunk.linesInHunk() - 1,
                hunk.linesInHunk(),
                commitId,
                hunk.origPath(),
                hunk.origSignature().toString()
            );
            file.hunks.push(hunkModel);
            this.logger.log(`file: ${JSON.stringify(file)}`);
        }
        return file;
    }
}