import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'
import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreatePlaceController } from './controllers/create-place.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreatePlaceController
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreatePlaceUseCase
  ]
})
export class HttpModule { }