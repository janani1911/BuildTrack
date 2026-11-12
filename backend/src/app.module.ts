import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildtrack',
    ),
    ProjectsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
