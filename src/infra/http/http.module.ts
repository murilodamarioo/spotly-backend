import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase
  ]
})
export class HttpModule { }