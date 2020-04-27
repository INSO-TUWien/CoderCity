import { Controller, Get, Logger, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GitService } from 'src/services/git/git.service';

@Controller('project/:projectId/branch')
export class BranchController {
    private readonly logger = new Logger(BranchController.name);

    constructor(private gitService: GitService) {}

    @Get()
    async getBranches(
        @Param('projectId') projectId
    ) {
        try {
            this.logger.log(`GET: branches`);
            const branches = [];
            const repo = await this.gitService.getRepoByProjectId(projectId);
            for (let [key, value] of repo.gitModel.branches) {
                this.logger.log(`Branch ${value}`);
                branches.push(value);
            }
            return branches;
        } catch (error) {
            throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
        }
    }
}
