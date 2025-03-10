import { Test, TestingModule } from '@nestjs/testing';
import { LandmarksController } from './landmarks.controller';
import { LandmarksService } from './landmarks.service';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateLandmarkDto } from './dto/create-landmark.dto';
import { GetLandmarksDto } from './dto/get-landmarks.dto';

describe('LandmarksController', () => {
  let controller: LandmarksController;
  let landmarksService: LandmarksService;
  let configService: ConfigService;

  const mockLandmark = {
    id: 1,
    lat: 48.8584,
    lng: 2.2945,
    name: 'Eiffel Tower',
    type: 'monument',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandmarksController],
      providers: [
        {
          provide: LandmarksService,
          useValue: {
            createLandmark: jest.fn(),
            getLandmarks: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'AUTH_SECRET') {
                return 'valid-secret'; // Mock AUTH_SECRET
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<LandmarksController>(LandmarksController);
    landmarksService = module.get<LandmarksService>(LandmarksService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /landmarks/webhook', () => {
    it('should create a landmark with valid authorization', async () => {
      const createLandmarkDto: CreateLandmarkDto = { lat: 48.8584, lng: 2.2945 };
      const result = [mockLandmark];

      jest.spyOn(landmarksService, 'createLandmark').mockResolvedValue(result);

      expect(await controller.createLandmark(createLandmarkDto, 'valid-secret')).toEqual(result);
      expect(landmarksService.createLandmark).toHaveBeenCalledWith(createLandmarkDto);
    });

    it('should throw UnauthorizedException with invalid authorization', async () => {
      const createLandmarkDto: CreateLandmarkDto = { lat: 48.8584, lng: 2.2945 };

      await expect(controller.createLandmark(createLandmarkDto, 'invalid-secret')).rejects.toThrow(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('GET /landmarks', () => {
    it('should return landmarks for valid coordinates', async () => {
      const getLandmarksDto: GetLandmarksDto = { lat: 48.8584, lng: 2.2945 };
      const result = [mockLandmark];

      jest.spyOn(landmarksService, 'getLandmarks').mockResolvedValue(result);

      expect(await controller.getLandmarks(getLandmarksDto)).toEqual(result);
      expect(landmarksService.getLandmarks).toHaveBeenCalledWith(getLandmarksDto);
    });

    it('should return an empty array if no landmarks are found', async () => {
      const getLandmarksDto: GetLandmarksDto = { lat: 0, lng: 0 };

      jest.spyOn(landmarksService, 'getLandmarks').mockResolvedValue([]);

      expect(await controller.getLandmarks(getLandmarksDto)).toEqual([]);
      expect(landmarksService.getLandmarks).toHaveBeenCalledWith(getLandmarksDto);
    });
  });
});