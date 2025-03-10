import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Landmark } from '../landmarks/entities/landmark.entity';
import { CacheEntity } from '../cache/entities/cache.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_DATABASE'),
        entities: [Landmark, CacheEntity], 
        synchronize: true, // synchronization False for production
        logging: true, 
      }),
    }),
  ],
})
export class DatabaseModule {}