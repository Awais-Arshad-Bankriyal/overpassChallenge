import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLandmarksDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number) // Transform the query parameter into a number
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number) // Transform the query parameter into a number
  lng: number;
}