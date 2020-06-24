import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as GridFsStorage from 'multer-gridfs-storage';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
    gridFsStorage: GridFsStorage;
    constructor() {
        this.gridFsStorage = new GridFsStorage({
            // [TODO] DESHARCODEAAR ESTO
            url: 'mongodb://localhost/access-control',
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    const filename = file.originalname.trim();
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'images',
                        metadata: {
                            used: 0
                        }
                    };
                    return resolve(fileInfo);
                });
            }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: this.gridFsStorage
        };
    }
}
