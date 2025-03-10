import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Landmark } from '../landmarks/entities/landmark.entity';
import { CacheEntity } from '../cache/entities/cache.entity'; // Import CacheEntity

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_DATABASE', 'landmarks.db'),
        entities: [Landmark, CacheEntity], // Include CacheEntity
        synchronize: true, // Automatically create database schema (for development only)
        logging: true, // Enable logging for debugging
      }),
    }),
  ],
})
export class DatabaseModule {}