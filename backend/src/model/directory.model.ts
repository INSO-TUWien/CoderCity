import { File } from "src/model/file.model";

export class Directory {
    public name: string = '';
    public fullPath: string = '';
    public files: File[] = [];
    public directories: Directory[] = [];

    constructor(
    ) {}
}
