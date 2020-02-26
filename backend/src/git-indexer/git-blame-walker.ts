import { Repository, Tree, Blame, Oid, BlameHunk } from "nodegit";
import { Logger } from "@nestjs/common";
import { File } from "src/model/file.model";
import { BlameHunk as BlameHunkModel } from "src/model/blamehunk.model";

export class GitBlameWalker {
    private readonly logger = new Logger(GitBlameWalker.name);
    private repo: Repository;

    constructor(
        private folderPath: string,
    ) {}

    async startIndexing(): Promise<void> {
        /**
         * Walk through all files in current revision.
         * @see https://github.com/nodegit/nodegit/blob/cb4a5309353add160fd55887314ff0bb69427706/examples/walk-tree.js
         */
        this.repo = await Repository.open(this.folderPath);
        const masterCommit = await this.repo.getMasterCommit();
        const filePaths = await this.getAllFilePathsOfCommit(masterCommit.sha());
        let files = [];
        filePaths.forEach((filePath) => {
            const file = this.getFileWithBlameHunks(filePath, masterCommit.sha());
            files.push(file);
        });
    }

    /**
     * Retrieves all files (file paths) of a commit given a commit id.
     * @param commitId
     */
    async getAllFilePathsOfCommit(commitId: string): Promise<string[]> {
        const commit = await this.repo.getCommit(commitId);
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
        const blame = await Blame.file(this.repo, fileName, {
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
