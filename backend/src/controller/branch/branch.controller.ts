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
            const branches = await this.gitService.getBranches(projectId);
            return branches;
        } catch (error) {
            throw new HttpException(`Requested ressource is not ready yet.`, HttpStatus.ACCEPTED);
        }
    }
}
