import { Post, Get, Param, Res, Controller, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('/images')
export class ImagesController {
    constructor(private filesService: ImagesService) {}

    @Post('')
    @UseInterceptors(FilesInterceptor('file'))
    upload(@UploadedFiles() files) {
        const response = [];
        files.forEach((file) => {
            const fileReponse = {
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                id: file.id,
                filename: file.filename,
                metadata: file.metadata,
                bucketName: file.bucketName,
                chunkSize: file.chunkSize,
                size: file.size,
                md5: file.md5,
                uploadDate: file.uploadDate,
                contentType: file.contentType
            };
            response.push(fileReponse);
        });
        return response;
    }

    @Get(':id')
    async getFile(@Param('id') id: string, @Res() res) {
        const file = await this.filesService.findInfo(id);
        const filestream = await this.filesService.readStream(id);
        if (!filestream) {
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED);
        }
        res.header('Content-Type', file.contentType);
        return filestream.pipe(res);
    }
}
