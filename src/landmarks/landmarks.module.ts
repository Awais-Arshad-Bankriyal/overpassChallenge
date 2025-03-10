import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandmarksController } from './landmarks.controller';
import { LandmarksService } from './landmarks.service';
import { Landmark } from './entities/landmark.entity';
import { OverpassModule } from '../overpass/overpass.module';
import { CacheModule } from '../cache/cache.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Landmark]), 
    OverpassModule,
    CacheModule, 
  ],
  controllers: [LandmarksController],
  providers: [LandmarksService],
})
export class LandmarksModule {}