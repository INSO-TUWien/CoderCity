import * as path from 'path';
import * as crypto from 'crypto';
import { ProjectData } from './projectdata.model.';

export class Project {
    id: string = '';
    name: string = '';
    fullPath: string = '';
    projectData: ProjectData;
}

export class ProjectUtil {
    static getProjectId(projectFullPath: string): string {
        const projectName = path.dirname(projectFullPath).split(path.sep).pop();

        // Project id is md5 hash of projectName without prior directories.
        const hash = crypto.createHash(`md5`).update(projectName).digest(`hex`);
        return hash;
    }
}
