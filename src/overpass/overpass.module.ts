import { Module } from '@nestjs/common';
import { OverpassService } from './overpass.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule], 
  providers: [OverpassService],
  exports: [OverpassService], 
})
export class OverpassModule {}