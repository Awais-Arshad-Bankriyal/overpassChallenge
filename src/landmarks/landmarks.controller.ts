import { Body, Controller, Get, Post, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { CreateLandmarkDto } from './dto/create-landmark.dto';
import { GetLandmarksDto } from './dto/get-landmarks.dto';
import { ConfigService } from '@nestjs/config';

@Controller('landmarks')
export class LandmarksController {
  constructor(
    private readonly landmarksService: LandmarksService,
    private configService: ConfigService, 
  ) {}

  @Post('webhook')
  async createLandmark(
    @Body() createLandmarkDto: CreateLandmarkDto,
    @Headers('Authorization') authHeader: string,
  ) {
    const authSecret = this.configService.get<string>('AUTH_SECRET');
    if (authHeader !== authSecret) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.landmarksService.createLandmark(createLandmarkDto);
  }

  @Get()
  async getLandmarks(@Query() getLandmarksDto: GetLandmarksDto) {
    return this.landmarksService.getLandmarks(getLandmarksDto);
  }
}