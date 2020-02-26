import { Controller, Param, Get } from '@nestjs/common';
import { CommitService } from 'src/services/commit/commit.service';
import { File } from "src/model/file.model";

@Controller('commit')
export class CommitController {

    constructor(private commitService: CommitService) {}

    @Get(':id')
    async getCommitById(@Param('id') id): Promise<File[]> {
        const files = await this.commitService.getFilesOfCommit(id);
        return files;
    }
}
