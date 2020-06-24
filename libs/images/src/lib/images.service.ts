import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class ImagesService {
    private fileModel: MongoGridFS;

    // [TODO] Revisar esta injection
    constructor(@InjectConnection() private readonly connection: Connection) {
        this.fileModel = new MongoGridFS(this.connection.db, 'images');
    }

    async readStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.fileModel.readFileStream(id);
    }

    async findInfo(id: string): Promise<any> {
        const result = await this.fileModel.findById(id).catch((err) => {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        });

        return {
            filename: result.filename,
            length: result.length,
            chunkSize: result.chunkSize,
            md5: result.md5,
            contentType: result.contentType
        };
    }

    async deleteFile(id: string): Promise<boolean> {
        return await this.fileModel.delete(id);
    }
}
