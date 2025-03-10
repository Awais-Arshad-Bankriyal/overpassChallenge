import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from './cache.service';
import { CacheEntity } from './entities/cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CacheEntity])], // Register the repository
  providers: [CacheService],
  exports: [CacheService], // Export the service
})
export class CacheModule {}