import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Get('/:id')
    async getFileFromGithub(@Param('id') filename: string) {
        return this.githubService.getFileFromGithubAndSave(filename)
    }

    @Post('/')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const path = file.originalname
        return this.githubService.uploadFileToGithub(file.buffer, path)
    }
}
