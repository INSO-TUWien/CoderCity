import { File } from "./file.model";

export class Directory {
    public name: string = '';
    public fullPath: string = '';
    public files: File[] = [];
    public directories: Directory[] = [];

    static fromObject(object: Directory) {
        const directory = new Directory();
        directory.name = object.name;
        directory.files = object.files;
        directory.fullPath = object.fullPath;
        directory.directories = object.directories;
        return directory;
    }
}
