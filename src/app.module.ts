import { Module } from '@nestjs/common';
import { LandmarksModule } from './landmarks/landmarks.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CacheModule,
    LandmarksModule,
  ],
})
export class AppModule {}