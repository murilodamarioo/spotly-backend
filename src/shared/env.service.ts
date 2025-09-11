import { ConfigService } from '@nestjs/config'
import { Env } from './env.config'

export class EnvService {
  constructor(private configService: ConfigService) { }

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }

}