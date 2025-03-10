import { Test, TestingModule } from '@nestjs/testing';
import { OverpassService } from './overpass.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe('OverpassService', () => {
  let service: OverpassService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OverpassService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'overpassUrl') {
                return 'https://overpass-api.de/api/interpreter';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OverpassService>(OverpassService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNearbyLandmarks', () => {
    it('should return landmarks for valid coordinates', async () => {
      const mockHeaders = new AxiosHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const mockResponse: AxiosResponse = {
        data: {
          elements: [
            {
              tags: {
                name: 'Eiffel Tower',
                tourism: 'attraction',
              },
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://overpass-api.de/api/interpreter',
          headers: mockHeaders,
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.getNearbyLandmarks(48.8584, 2.2945);

      expect(result).toEqual([
        {
          lat: 48.8584,
          lng: 2.2945,
          name: 'Eiffel Tower',
          type: 'attraction',
        },
      ]);

      // Instead of using toHaveBeenCalledWith with matchers for the second argument,
      // capture the call arguments and test each individually.
      expect(httpService.post).toHaveBeenCalledTimes(1);
      const callArgs = (httpService.post as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('https://overpass-api.de/api/interpreter');
      expect(typeof callArgs[1]).toBe('string');
      expect(callArgs[2]).toEqual(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('should handle missing name and type in Overpass API response', async () => {
      const mockHeaders = new AxiosHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const mockResponse: AxiosResponse = {
        data: {
          elements: [
            {
              tags: {}, // No name or type provided
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://overpass-api.de/api/interpreter',
          headers: mockHeaders,
        },
      };

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.getNearbyLandmarks(48.8584, 2.2945);

      expect(result).toEqual([
        {
          lat: 48.8584,
          lng: 2.2945,
          name: null,
          type: null,
        },
      ]);
    });

    it('should throw an error if Overpass API request fails', async () => {
      const mockError = new Error('API failed');
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => mockError));

      await expect(service.getNearbyLandmarks(48.8584, 2.2945)).rejects.toThrow(
        new HttpException(
          'Failed to fetch data from Overpass API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
