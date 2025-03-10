import { Module } from '@nestjs/common';
import { OverpassService } from './overpass.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule], // HttpModule is used for making HTTP requests
  providers: [OverpassService],
  exports: [OverpassService], // Export the service so it can be used in other modules
})
export class OverpassModule {}