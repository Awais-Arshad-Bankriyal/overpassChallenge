import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  constructor(private configService: ConfigService) {}

  async get(key: string): Promise<any> {
    const cachedItem = this.cache.get(key);
    if (cachedItem && cachedItem.expiresAt > Date.now()) {
      return cachedItem.data;
    }
    this.cache.delete(key); // Remove expired cache
    return null;
  }

  async set(key: string, value: any): Promise<void> {
    const ttl = this.configService.get<number>('cacheTtl', 3600); // Default TTL: 1 hour
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { data: value, expiresAt });
  }
}