import { Controller, Get } from '@nestjs/common';
import { ProjectService } from 'src/services/project/project.service';

@Controller('project')
export class ProjectController {

    constructor(private projectService: ProjectService) {}

    @Get()
    getProject() {
        return this.projectService.project;
    }
}
