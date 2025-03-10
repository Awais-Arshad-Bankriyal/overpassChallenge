import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OverpassService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getNearbyLandmarks(lat: number, lng: number) {
   
    const overpassUrl = this.configService.get<string>('overpassUrl', 'https://overpass-api.de/api/interpreter'); 
    const query = `[out:json];
      (
        way["tourism"="attraction"](around:1000,${lat},${lng});
        relation["tourism"="attraction"](around:500,${lat},${lng});
      );
      out body;
      >;
      out skel qt;`;
  
    try {
      
      const response = await firstValueFrom(
        this.httpService.post(overpassUrl, query, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      
      return response.data.elements.map((element) => ({
        lat,
        lng,
        name: element.tags?.name || null,
        type: element.tags?.tourism || null,
      }));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch data from Overpass API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}