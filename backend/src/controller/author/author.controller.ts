import { Controller, Logger, Get, Param } from '@nestjs/common';
import { AuthorService } from 'src/services/author/author.service';
import { Signature } from 'src/model/signature.model';

@Controller('project/:projectId/author')
export class AuthorController {
    private readonly logger = new Logger(AuthorController.name);

    constructor(
        private authorService: AuthorService
    ) {
    }

    @Get()
    async getAuthors(
        @Param('projectId') projectId
    ): Promise<Signature[]> {
        return this.authorService.getAllAuthors(projectId);
    }
}
