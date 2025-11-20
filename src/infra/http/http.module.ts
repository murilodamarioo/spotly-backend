import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'
import { GetProfileUseCase } from '@/domain/core/application/use-cases/get-profile'
import { EditUserUseCase } from '@/domain/core/application/use-cases/edit-user'
import { DeleteAccountUseCase } from '@/domain/core/application/use-cases/delete-account'
import { FetchPlacesUseCase } from '@/domain/core/application/use-cases/fetch-places'
import { GetPlaceUseCase } from '@/domain/core/application/use-cases/get-place'
import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { EditPlaceUseCase } from '@/domain/core/application/use-cases/edit-place'
import { DeletePlaceUseCase } from '@/domain/core/application/use-cases/delete-place'
import { UploadAndCreateAttachmentUseCase } from '@/domain/core/application/use-cases/upload-and-create-attachment'
import { CreateReviewUseCase } from '@/domain/core/application/use-cases/create-review'
import { DeleteReviewUseCase } from '@/domain/core/application/use-cases/delete-review'
import { FetchReviewsUseCase } from '@/domain/core/application/use-cases/fetch-review'
import { GetReviewUseCase } from '@/domain/core/application/use-cases/get-review'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { EditUserController } from './controllers/edit-user.controller'
import { DeleteAccountController } from './controllers/delete-account.controller'
import { FetchPlacesController } from './controllers/fetch-places.controller'
import { GetPlaceController } from './controllers/get-place.controller'
import { CreatePlaceController } from './controllers/create-place.controller'
import { EditPlaceController } from './controllers/edit-place.controller'
import { DeletePlaceController } from './controllers/delete-place.controller'
import { UploadAndCreateAttachmentController } from './controllers/upload-and-create-attachment.controller'
import { CreateReviewController } from './controllers/create-review.controller'
import { DeleteReviewController } from './controllers/delete-review.controller'
import { FetchReviewsController } from './controllers/fetch-reviews.controller'
import { GetReviewController } from './controllers/get-review.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    EditUserController,
    DeleteAccountController,
    FetchPlacesController,
    GetPlaceController,
    CreatePlaceController,
    EditPlaceController,
    DeletePlaceController,
    UploadAndCreateAttachmentController,
    CreateReviewController,
    DeleteReviewController,
    FetchReviewsController,
    GetReviewController
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetProfileUseCase,
    EditUserUseCase,
    DeleteAccountUseCase,
    FetchPlacesUseCase,
    GetPlaceUseCase,
    CreatePlaceUseCase,
    EditPlaceUseCase,
    DeletePlaceUseCase,
    UploadAndCreateAttachmentUseCase,
    CreateReviewUseCase,
    DeleteReviewUseCase,
    FetchReviewsUseCase,
    GetReviewUseCase
  ]
})
export class HttpModule { }