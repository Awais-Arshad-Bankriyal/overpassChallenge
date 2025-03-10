import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Landmark } from '../landmarks/entities/landmark.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('database.database', 'landmarks.db'),
        entities: [Landmark],
        synchronize: true, // Automatically create database schema (for development only)
        logging: true, // Log SQL queries
      }),
    }),
  ],
})
export class DatabaseModule {}