import { Injectable } from '@nestjs/common'

import { RedisService } from './redis.service'

import { CacheRepository } from '../cache-repository'

@Injectable()
export class RedisCacheRepository implements CacheRepository {

  constructor(private redis: RedisService) { }

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 30)
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key)

    return value
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

}