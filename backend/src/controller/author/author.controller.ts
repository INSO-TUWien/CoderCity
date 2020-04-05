import { Controller, Logger, Get } from '@nestjs/common';
import { AuthorService } from 'src/services/author/author.service';
import { Signature } from 'src/model/signature.model';

@Controller('author')
export class AuthorController {
    private readonly logger = new Logger(AuthorController.name);

    constructor(
        private authorService: AuthorService
    ) {
    }

    @Get()
    getAuthors(): Signature[] {
        return this.authorService.getAllAuthors();
    }
}
