import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LandmarksModule } from './landmarks/landmarks.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env file
    DatabaseModule,
    CacheModule,
    LandmarksModule,
  ],
})
export class AppModule {}