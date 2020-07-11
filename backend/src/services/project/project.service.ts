import { Injectable, Logger } from '@nestjs/common';
import { Project } from 'src/model/project.model';
import * as find from 'findit';
import * as path from 'path';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
    private readonly logger = new Logger(ProjectService.name);
    projectFolderPath: string;
    projects: Project[] = []; // Stores git projects

    constructor(private configService: ConfigService) {
        this.projectFolderPath = this.configService.get<string>('GIT_PROJECTS_FOLDER');
        this.indexProjects();
    }

    findProject(id: string) {
        const result = this.projects.find((project) => project.id === id);
        if (result === undefined) {
            return {};
        } else {
            return result;
        }
    }

    findAll(): Project[] {
        return this.projects;
    }

    /**
     * Retrieves a list of all git projects given a folder path.
     */
    private indexProjects(): void {
        this.logger.log(`Started indexProjects`);
        const finder = find(this.projectFolderPath);
        finder.on('directory', (dir, stat, stop) => {
            const base = path.basename(dir);
            if (base === 'node_modules') {
                stop();
                // Skip looking inside the node_modules folder.
            } else if (base === '.git') {
                this.logger.log(`Found project ${dir}`);
                const projectName = path.dirname(dir).split(path.sep).pop();

                // Project id is md5 hash of projectName without prior directories.
                const hash = crypto.createHash(`md5`).update(projectName).digest(`hex`);

                const project = new Project();
                project.fullPath = dir;
                project.name = projectName;
                project.id = hash;
                this.projects.push(project);
                stop();
            }
        });
    }
}
