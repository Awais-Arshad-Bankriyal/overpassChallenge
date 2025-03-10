import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { CacheService } from './cache.service';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    RedisModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
        type: 'single', 
        url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'), 
      }),
      inject: [ConfigService], 
    }),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT', 
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL', 'redis://localhost:6379'));
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CacheService], 
})
export class CacheModule {} 