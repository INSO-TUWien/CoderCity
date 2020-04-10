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
            return new File(file.name);
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