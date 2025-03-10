import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheEntity } from './entities/cache.entity';

@Injectable()
export class CacheService {
  constructor(
    @InjectRepository(CacheEntity)
    private cacheRepository: Repository<CacheEntity>,
  ) {}

  async get(key: string): Promise<any> {
    const cacheEntry = await this.cacheRepository.findOne({ where: { key } });
    if (cacheEntry && cacheEntry.expiresAt > new Date()) {
      return JSON.parse(cacheEntry.value);
    }
    await this.cacheRepository.delete({ key }); // Remove expired cache
    return null;
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    const expiresAt = new Date(Date.now() + ttl * 1000); // TTL in seconds
    const cacheEntry = this.cacheRepository.create({
      key,
      value: JSON.stringify(value),
      expiresAt,
    });
    await this.cacheRepository.save(cacheEntry);
  }
}