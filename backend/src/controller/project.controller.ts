import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from 'src/services/project/project.service';
import { ProjectData } from 'src/model/projectdata.model.';
import { AuthorService } from 'src/services/author/author.service';
import { GitService } from 'src/services/git/git.service';

@Controller('api/project')
export class ProjectController {

    constructor(
        private projectService: ProjectService,
        private authorService: AuthorService,
        private gitService: GitService
    ) {}

    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    @Get(':projectId')
    async findOne(
        @Param('projectId') projectId: string) {
        const projectData = new ProjectData();

        const authors = await this.authorService.getAllAuthors(projectId);
        const commits = await this.gitService.getCommits(projectId);
        const branches = await this.gitService.getBranches(projectId);

        projectData.authors = authors;
        projectData.commits = commits;
        projectData.branches = branches;

        return projectData;
    }
    
}
