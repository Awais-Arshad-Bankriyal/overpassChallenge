import { Body, Controller, Get, Post, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { LandmarksService } from './landmarks.service';
import { CreateLandmarkDto } from './dto/create-landmark.dto';
import { GetLandmarksDto } from './dto/get-landmarks.dto';

@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  @Post('webhook')
  async createLandmark(
    @Body() createLandmarkDto: CreateLandmarkDto, // Validates the request body
    @Headers('Authorization') authHeader: string,
  ) {
    if (authHeader !== 'secret') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.landmarksService.createLandmark(createLandmarkDto);
  }
  
  @Get()
  async getLandmarks(@Query() getLandmarksDto: GetLandmarksDto) { // Validates the query parameters
    
    return this.landmarksService.getLandmarks(getLandmarksDto);
  }
}