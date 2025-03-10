import { Test, TestingModule } from '@nestjs/testing';
import { LandmarksService } from './landmarks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Landmark } from './entities/landmark.entity';
import { Repository } from 'typeorm';
import { OverpassService } from '../overpass/overpass.service';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LandmarksService', () => {
  let service: LandmarksService;
  let landmarksRepository: Repository<Landmark>;
  let overpassService: OverpassService;
  let cacheService: CacheService;
  let configService: ConfigService;

  const mockLandmark = new Landmark();
  mockLandmark.id = 1;
  mockLandmark.lat = 48.8584;
  mockLandmark.lng = 2.2945;
  mockLandmark.name = 'Eiffel Tower';
  mockLandmark.type = 'monument';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandmarksService,
        {
          provide: getRepositoryToken(Landmark),
          useValue: {
            find: jest.fn(),
            save: jest.fn().mockImplementation((entities) => {
              if (Array.isArray(entities)) {
                return Promise.resolve(entities); // Handle array of entities
              }
              return Promise.resolve(entities); // Handle single entity
            }),
          },
        },
        {
          provide: OverpassService,
          useValue: {
            getNearbyLandmarks: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'CACHE_TTL') {
                return 3600; // Default TTL
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LandmarksService>(LandmarksService);
    landmarksRepository = module.get<Repository<Landmark>>(getRepositoryToken(Landmark));
    overpassService = module.get<OverpassService>(OverpassService);
    cacheService = module.get<CacheService>(CacheService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLandmark', () => {
    it('should return cached landmarks if available', async () => {
      const cacheKey = 'landmarks:48.8584:2.2945';
      const cachedLandmarks = [mockLandmark];

      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedLandmarks);

      const result = await service.createLandmark({ lat: 48.8584, lng: 2.2945 });

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(cachedLandmarks);
    });

    it('should fetch landmarks from Overpass API if not cached', async () => {
      const cacheKey = 'landmarks:48.8584:2.2945';
      const rawLandmarks = [{ name: 'Eiffel Tower', type: 'monument' }];
      const validLandmarks = rawLandmarks.map((landmark) => {
        const landmarkEntity = new Landmark();
        landmarkEntity.lat = 48.8584;
        landmarkEntity.lng = 2.2945;
        landmarkEntity.name = landmark.name;
        landmarkEntity.type = landmark.type;
        return landmarkEntity;
      });

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(overpassService, 'getNearbyLandmarks').mockResolvedValue(rawLandmarks);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.createLandmark({ lat: 48.8584, lng: 2.2945 });

      expect(overpassService.getNearbyLandmarks).toHaveBeenCalledWith(48.8584, 2.2945);
      expect(cacheService.set).toHaveBeenCalledWith(cacheKey, validLandmarks, expect.any(Number));
      expect(result).toEqual(validLandmarks);
    });

    it('should throw an error if Overpass API fails', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(overpassService, 'getNearbyLandmarks').mockRejectedValue(new Error('API failed'));

      await expect(service.createLandmark({ lat: 48.8584, lng: 2.2945 })).rejects.toThrow(
        new HttpException('Failed to fetch landmarks', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getLandmarks', () => {
    it('should return cached landmarks if available', async () => {
      const cacheKey = 'landmarks:48.8584:2.2945';
      const cachedLandmarks = [mockLandmark];

      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedLandmarks);

      const result = await service.getLandmarks({ lat: 48.8584, lng: 2.2945 });

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(cachedLandmarks);
    });

    it('should return landmarks from the database if not cached', async () => {
      const cacheKey = 'landmarks:48.8584:2.2945';
      const dbLandmarks = [mockLandmark];

      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(landmarksRepository, 'find').mockResolvedValue(dbLandmarks);
      jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

      const result = await service.getLandmarks({ lat: 48.8584, lng: 2.2945 });

      expect(landmarksRepository.find).toHaveBeenCalledWith({ where: { lat: 48.8584, lng: 2.2945 } });
      expect(cacheService.set).toHaveBeenCalledWith(cacheKey, dbLandmarks, expect.any(Number));
      expect(result).toEqual(dbLandmarks);
    });

    it('should return an empty array if no landmarks are found', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(landmarksRepository, 'find').mockResolvedValue([]);

      const result = await service.getLandmarks({ lat: 0, lng: 0 });

      expect(result).toEqual([]);
    });
  });
});