import { Directory } from '../directory.model';
import { File } from "../file.model";

export class IntersectableDirectory {
    public name: string = '';
    public fullPath: string = '';
    public files: File[] = [];
    public directories: Directory[] = [];


    static fromObject(object: Directory): IntersectableDirectory {
        const directory = new IntersectableDirectory();
        directory.name = object.name;
        directory.files = object.files.map((file: File) => {
            // Create new instance of file type. (Necessary since objects retrieved via http requests do not have typing, but raycaster performs a type check via instanceof)
            const fileObject = new File();
            fileObject.name = file.name;
            fileObject.hunks = file.hunks;
            fileObject.fullPath = file.fullPath;
            fileObject.lineCount = file.lineCount;
            return fileObject;
        });
        directory.fullPath = object.fullPath;
        directory.directories = object.directories.map(directory => {
            const dir =  new Directory();
            dir.name = directory.name;
            dir.fullPath = directory.fullPath;
            return dir;
        });
        return directory;
    }
}