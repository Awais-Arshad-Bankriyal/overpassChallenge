import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from './entities/landmark.entity';
import { OverpassService } from '../overpass/overpass.service';
import { CreateLandmarkDto } from './dto/create-landmark.dto';
import { GetLandmarksDto } from './dto/get-landmarks.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class LandmarksService {
  constructor(
    @InjectRepository(Landmark)
    private landmarksRepository: Repository<Landmark>,
    private overpassService: OverpassService,
    private cacheService: CacheService,
  ) {}

  async createLandmark(createLandmarkDto: CreateLandmarkDto) {
    const { lat, lng } = createLandmarkDto;
    const cacheKey = `landmarks:${lat}:${lng}`;

    
    const cachedLandmarks = await this.cacheService.get(cacheKey);
    if (cachedLandmarks) {
      return cachedLandmarks;
    }

  
    const landmarks = await this.overpassService.getNearbyLandmarks(lat, lng);

    
    if (landmarks.length > 0) {
      await this.landmarksRepository.save(landmarks);
    } else {
      await this.landmarksRepository.save({ lat, lng });
    }

    
    await this.cacheService.set(cacheKey, landmarks);

    return landmarks;
  }

  async getLandmarks(getLandmarksDto: GetLandmarksDto) {
    const { lat, lng } = getLandmarksDto;
    const cacheKey = `landmarks:${lat}:${lng}`;

    
    const cachedLandmarks = await this.cacheService.get(cacheKey);
    if (cachedLandmarks) {
      return cachedLandmarks;
    }

    
    const landmarks = await this.landmarksRepository.find({ where: { lat, lng } });
    
    if (landmarks.length > 0) {
      await this.cacheService.set(cacheKey, landmarks);
    }

    return landmarks;
  }
}