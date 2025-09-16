import { Module } from '@nestjs/common'

import { BcryptHasher } from './bcrypt-hasher'

import { HashGenerator } from './hash-generator'
import { HashComparer } from './hash-compare'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher
    }
  ],
  exports: [HashComparer, HashGenerator]
})
export class CryptographyModule { }