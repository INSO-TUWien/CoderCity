import { Directory } from "./directory.model";

export interface ProjectSnapshot {
    projectName: string,
    commit: string, // Sha of commit
    files: string[], // List of all files as string
    projectFiles: Directory, // List of all project files
}