import { Module } from '@nestjs/common'

import { Encrypter, HashComparer, HashGenerator } from '@/domain/core/application/cryptography'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter
    }
  ],
  exports: [HashGenerator, HashComparer, Encrypter]
})
export class CryptographyModule { }