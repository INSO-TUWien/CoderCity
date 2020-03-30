import { Injectable } from '@nestjs/common';
import { Project } from 'src/model/project.model';

@Injectable()
export class ProjectService {
    project: Project = new Project();

    setProjectName(name: string) {
        this.project.name = name;
    }
}
