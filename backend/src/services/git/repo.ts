
import { Repository as NodeGitRepository, Tree, Blame, Oid, Revwalk, Commit } from 'nodegit';
import { Logger } from '@nestjs/common';
import { File, calculateLinecount } from "src/model/file.model";
import { BlameHunk as BlameHunkModel } from "src/model/blamehunk.model";
import { Directory } from 'src/model/directory.model';
import { GitProject } from 'src/services/git/git-project';
import { Signature } from 'src/model/signature.model';
import { RepoIndexer } from 'src/services/git/repo-indexer';
import { ProjectUtil } from 'src/model/project.model';

export class Repository {

    private readonly logger = new Logger(Repository.name);
    private repository: NodeGitRepository;
    public gitModel: GitProject;
    private repoIndexer: RepoIndexer;

    constructor(
        public readonly folderPath: string,
    ) {
    }

    async openRepo(): Promise<void> {
        this.repository = await NodeGitRepository.open(this.folderPath);
    }

    async startIndexing(): Promise<void> {
        this.gitModel = new GitProject();
        this.repoIndexer = new RepoIndexer(this.folderPath, this.gitModel, this);
        await this.repoIndexer.startIndexing();
    }

    isOpen(): boolean {
        return (this.repository != null);
    }

    getRepo(): NodeGitRepository {
        return this.repository;
    }

    /**
     * Retrieves project files in directory folder structure (including directories) at a specified commit.
     * @param commitId
     */
    async getFilesWithDirectoriesOfCommit(commitId: string): Promise<Directory> {
        const commit = await this.repository.getCommit(commitId);
        const tree = await commit.getTree();
        const directory = await this.buildProjectModel(tree, null, commitId);
        return directory;
    }

    /**
     * Executes a provided function for each commit.
     * @param operation the funciton that should be executed
     */
    async foreachCommit(operation: (commitData: { projectId: string; commitId: string }) => void ) {
        const repo = this.repository;
        const branchNames = await RepoIndexer.getAllBranchNames(repo);
        const projectId = ProjectUtil.getProjectId(this.folderPath);
        await branchNames.forEach(async branch => {
          this.logger.log(`Indexing commits of branch ${branch}`);
          const walker = Revwalk.create(repo);
          const branchCommit = await repo.getBranchCommit(branch);
          if (branchCommit != null) {
            walker.push(branchCommit.id());
            walker.sorting(Revwalk.SORT.TOPOLOGICAL);
            await walker
              .getCommitsUntil(() => true)
              .then(async (commits: Commit[]) => {
                // Get all commit ids (sha) and proceed with indexing all project files at that commit and saving result to the mongodb database
                commits.forEach(commit => {
                  const commitId = commit.sha();
                  // Execute externally provided operation
                  operation({
                    projectId: projectId,
                    commitId: commitId
                  });
                })
              });
          }
        });
    }

    /**
     * Builds directory model folder structure recursively.
     * @param tree
     * @param directory
     */
    private async buildProjectModel(tree: Tree, directory: Directory, commitId: string): Promise<Directory> {
        if (tree == null) {
            this.logger.error(`buildProjectModel: Invalid parameter: tree is null`);
        }

        // If directory is null, then directory is the root directory
        if (directory == null) {
            directory = new Directory();
            directory.name = '/';
            directory.fullPath = '/';
        }
        const entries = tree.entries();
        this.logger.log(`getFilesWithDirectories: ${entries.length}`);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const entryName = entry.name();
            if (entry.isFile()) {
                // Create a file entry
                const file = await this.getFileWithBlameHunks(entry.path(), commitId);
                file.name = entryName;
                directory.files.push(file);
                this.logger.log(`File entryName: ${entryName}`);
            } else if (entry.isDirectory()) {
                const entryDirectory = new Directory();
                entryDirectory.name = entryName;
                entryDirectory.fullPath = entry.path();
                directory.directories.push(entryDirectory);
                // Build model recursively in sub folderes
                const tree = await entry.getTree();
                this.logger.log(`Folder entryName: ${entryName}`);
                await this.buildProjectModel(tree, entryDirectory, commitId);
            }
        }
        return directory;
    }

    /**
     * Retrieves all project files (only files/ no folders) at a specified commit
     * @param commitId
     */
    async getFilesForCommit(commitId: string): Promise<File[]> {
        /**
         * Walk through all files in current revision.
         * @see https://github.com/nodegit/nodegit/blob/cb4a5309353add160fd55887314ff0bb69427706/examples/walk-tree.js
         */
        const filePaths = await this.getAllFilePathsOfCommit(commitId);
        this.logger.debug(`getAllFilePathsOfCommit : ${JSON.stringify(filePaths)}`);
        let files = [];
        await Promise.all(filePaths.map(async (filePath) => {
            const file = await this.getFileWithBlameHunks(filePath, commitId);
            files.push(file);
        }));
        await this.getFilesWithDirectoriesOfCommit(commitId);
        return files;
    }

    /**
     * Retrieves all files (file paths) of a commit given a commit id.
     * @param commitId
     */
    async getAllFilePathsOfCommit(commitId: string): Promise<string[]> {
        const commit = await this.repository.getCommit(commitId);
        const tree = await commit.getTree();
        this.logger.debug(`${commitId} tree entry count: ${tree.entryCount()}`);
        const walker = tree.walk();
        const filePaths = [];

        // Promisify tree walker callback
        const filePathsPromise = new Promise<string[]>((resolve, reject) => {
            try {
                walker.on('end', (trees: Tree[]) => {
                    // Retrieves files and directories of commit
                    trees.forEach((tree) => {
                        // this.logger.debug(`end: ${tree.path()}`);
                        filePaths.push(tree.path());
                    });
                    resolve(filePaths);
                });
                walker.start();
            } catch (e) {
                reject(e);
            }
        });

        return filePathsPromise;
    }

    /**
     * Parses blame hunks for a given file
     * @see https://github.com/nodegit/nodegit/issues/1264
     * @param filename
     */
    async getFileWithBlameHunks(filePath: string, commitId: string): Promise<File> {
        this.logger.log(`Parsing blame hunks for ${filePath}. Commit: ${commitId}`);
        const blame = await Blame.file(this.repository, filePath, {
            newestCommit: Oid.fromString(commitId)
        });

        // Create file
        const file = new File(filePath);
        for (let i = 0; i < blame.getHunkCount(); i++) {
            const hunk = blame.getHunkByIndex(i);

            // Use finalStartLineNumber instead of origLineNumber.
            // OrigLine number is the line number of the hunk at the state where the commit of the hunk was made.
            // Whereas finalLineNumber takes into account of other hunks (code segments) inserted in between.
            const hunkModel = new BlameHunkModel(
                // @ts-ignore
                hunk.finalStartLineNumber(),
                // @ts-ignore
                hunk.finalStartLineNumber() + hunk.linesInHunk() - 1,
                // @ts-ignore
                hunk.linesInHunk(),
                // @ts-ignore
                hunk.origCommitId().tostrS(),
                // @ts-ignore
                hunk.origPath(),
                // @ts-ignore
                new Signature(hunk.origSignature().name(), hunk.origSignature().email())
            );
            file.hunks.push(hunkModel);
            // this.logger.log(`file: ${JSON.stringify(file)}`);
        }

        // Calculate total length
        file.lineCount = calculateLinecount(file);
        return file;
    }
}