import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'
import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { EditPlaceUseCase } from '@/domain/core/application/use-cases/edit-place'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreatePlaceController } from './controllers/create-place.controller'
import { EditPlaceController } from './controllers/edit-place.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreatePlaceController,
    EditPlaceController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreatePlaceUseCase,
    EditPlaceUseCase
  ]
})
export class HttpModule { }