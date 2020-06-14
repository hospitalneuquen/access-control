import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/access-control', { useNewUrlParser: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
