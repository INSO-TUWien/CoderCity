import { Controller, Get, Param } from '@nestjs/common';
import { ProjectData } from 'src/model/projectdata.model.';
import { AuthorService } from 'src/services/author/author.service';
import { GitProjectService } from 'src/services/git/git-project.service';

@Controller('api/project')
export class ProjectController {

    constructor(
        private projectService: GitProjectService,
        private authorService: AuthorService,
        private gitService: GitProjectService
    ) {}

    /**
     * Retrieves a list of all projects
     */
    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    /**
     * Retrieves data of a specific git project
     * @param projectId 
     */
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
