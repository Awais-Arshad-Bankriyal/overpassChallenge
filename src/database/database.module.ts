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
        synchronize: true, 
        logging: true, 
      }),
    }),
  ],
})
export class DatabaseModule {}