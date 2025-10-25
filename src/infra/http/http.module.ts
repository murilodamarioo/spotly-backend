import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'

import { CreateAccountController } from './controllers/create-account.controller'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController
  ],
  providers: [
    RegisterUserUseCase
  ]
})
export class HttpModule { }