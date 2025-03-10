import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landmark } from './entities/landmark.entity';
import { OverpassService } from '../overpass/overpass.service';
import { CreateLandmarkDto } from './dto/create-landmark.dto';
import { GetLandmarksDto } from './dto/get-landmarks.dto';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LandmarksService {
  private readonly logger = new Logger(LandmarksService.name);
  private readonly cacheTtl: number;

  constructor(
    @InjectRepository(Landmark)
    private readonly landmarksRepository: Repository<Landmark>,
    private readonly overpassService: OverpassService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl = this.configService.get<number>('CACHE_TTL', 3600); 
  }

  /**
   * Create or fetch landmarks for the given coordinates.
   * @param createLandmarkDto - DTO containing latitude and longitude.
   * @returns List of landmarks.
   */
  async createLandmark(createLandmarkDto: CreateLandmarkDto) {
    const { lat, lng } = createLandmarkDto;
    const cacheKey = `landmarks:${lat}:${lng}`;
  
    this.logger.log(`Checking cache for ${cacheKey}`);
    const cachedLandmarks = await this.cacheService.get(cacheKey);
    if (cachedLandmarks) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return cachedLandmarks;
    }
  
    try {
      this.logger.log(`Fetching Overpass API for ${lat}, ${lng}`);
      const rawLandmarks = await this.overpassService.getNearbyLandmarks(lat, lng);
      
      // Map rawLandmarks to Landmark instances
      const validLandmarks = rawLandmarks
        .filter((l) => l.name && l.type)
        .map((landmark) => {
          const landmarkEntity = new Landmark();
          landmarkEntity.lat = lat;
          landmarkEntity.lng = lng;
          landmarkEntity.name = landmark.name;
          landmarkEntity.type = landmark.type;
          return landmarkEntity;
        });
  
      if (validLandmarks.length) {
        await this.landmarksRepository.save(validLandmarks);
        this.logger.log(`Saved ${validLandmarks.length} landmarks to database`);
      } else {
        const coordinateEntity = new Landmark();
        coordinateEntity.lat = lat;
        coordinateEntity.lng = lng;
        await this.landmarksRepository.save(coordinateEntity);
        this.logger.warn(`No landmarks found for ${lat}, ${lng}, saved coordinates only`);
      }
  
      await this.cacheService.set(cacheKey, validLandmarks, this.cacheTtl);
      this.logger.log(`Cached landmarks for ${cacheKey}`);
  
      return validLandmarks;
    } catch (error) {
      this.logger.error(`Overpass API request failed: ${error.message}`);
      throw new HttpException('Failed to fetch landmarks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get landmarks for the given coordinates.
   * @param getLandmarksDto - DTO containing latitude and longitude.
   * @returns List of landmarks.
   */
  async getLandmarks(getLandmarksDto: GetLandmarksDto) {
    const { lat, lng } = getLandmarksDto;
    const cacheKey = `landmarks:${lat}:${lng}`;

 
    this.logger.log(`Fetching landmarks for ${cacheKey}`);
    const cachedLandmarks = await this.cacheService.get(cacheKey);
    if (cachedLandmarks) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return cachedLandmarks;
    }

   
    const dbLandmarks = await this.landmarksRepository.find({ where: { lat, lng } });
    if (dbLandmarks.length) {
     
      await this.cacheService.set(cacheKey, dbLandmarks, this.cacheTtl);
      this.logger.log(`Cached ${dbLandmarks.length} landmarks for ${cacheKey}`);
      return dbLandmarks;
    }

    
    this.logger.warn(`No landmarks found for ${lat}, ${lng}`);
    return [];
  }
}