import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateLandmarkDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lng: number;
}