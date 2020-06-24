import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

/**
 * [DOC] https://medium.com/@khoa.phan.9xset/nestjs-file-uploading-using-multer-gridfs-7569a1b48022
 */

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: GridFsMulterConfigService
        })
    ],
    controllers: [ImagesController],
    providers: [GridFsMulterConfigService, ImagesService],
    exports: []
})
export class ImagesModule {}
