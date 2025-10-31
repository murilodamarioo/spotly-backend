import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'
import { GetProfileUseCase } from '@/domain/core/application/use-cases/get-profile'
import { EditUserUseCase } from '@/domain/core/application/use-cases/edit-user'
import { DeleteAccountUseCase } from '@/domain/core/application/use-cases/delete-account'
import { FetchPlacesUseCase } from '@/domain/core/application/use-cases/fetch-places'
import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { EditPlaceUseCase } from '@/domain/core/application/use-cases/edit-place'
import { DeletePlaceUseCase } from '@/domain/core/application/use-cases/delete-place'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { EditUserController } from './controllers/edit-user.controller'
import { DeleteAccountController } from './controllers/delete-account.controller'
import { FetchPlacesController } from './controllers/fetch-places.controller'
import { CreatePlaceController } from './controllers/create-place.controller'
import { EditPlaceController } from './controllers/edit-place.controller'
import { DeletePlaceController } from './controllers/delete-place.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    EditUserController,
    DeleteAccountController,
    FetchPlacesController,
    CreatePlaceController,
    EditPlaceController,
    DeletePlaceController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetProfileUseCase,
    EditUserUseCase,
    DeleteAccountUseCase,
    FetchPlacesUseCase,
    CreatePlaceUseCase,
    EditPlaceUseCase,
    DeletePlaceUseCase
  ]
})
export class HttpModule { }