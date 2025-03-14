import { Module } from '@nestjs/common';
import { LandmarksController } from './landmarks.controller';
import { LandmarksService } from './landmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landmark } from './entities/landmark.entity';
import { OverpassModule } from '../overpass/overpass.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Landmark]), // Register Landmark entity
    OverpassModule, // Import OverpassModule
    CacheModule,
  ],
  controllers: [LandmarksController],
  providers: [LandmarksService],
})
export class LandmarksModule {}