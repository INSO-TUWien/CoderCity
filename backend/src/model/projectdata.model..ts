import { Commit } from "./commit.model";
import { Branch } from "./branch.model";
import { Signature } from "./signature.model";

export class ProjectData {
    commits: Commit[];
    branches: Branch[];
    authors: Signature[];
}
