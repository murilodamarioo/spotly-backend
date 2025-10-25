import { Module } from '@nestjs/common'

import { HashGenerator } from '@/domain/core/application/cryptography'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher
    }
  ],
  exports: [HashGenerator]
})
export class CryptographyModule { }