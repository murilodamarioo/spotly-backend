import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'
import { MailModule } from '../mail/mail.module'

import { RegisterUserUseCase } from '@/domain/core/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/core/application/use-cases/authenticate-user'
import { GetProfileUseCase } from '@/domain/core/application/use-cases/get-profile'
import { EditUserUseCase } from '@/domain/core/application/use-cases/edit-user'
import { DeleteAccountUseCase } from '@/domain/core/application/use-cases/delete-account'
import { FetchPlacesByFilterUseCase } from '@/domain/core/application/use-cases/fetch-places-by-filter'
import { GetPlaceUseCase } from '@/domain/core/application/use-cases/get-place'
import { CreatePlaceUseCase } from '@/domain/core/application/use-cases/create-place'
import { EditPlaceUseCase } from '@/domain/core/application/use-cases/edit-place'
import { DeletePlaceUseCase } from '@/domain/core/application/use-cases/delete-place'
import { UploadAndCreateAttachmentUseCase } from '@/domain/core/application/use-cases/upload-and-create-attachment'
import { CreateReviewUseCase } from '@/domain/core/application/use-cases/create-review'
import { DeleteReviewUseCase } from '@/domain/core/application/use-cases/delete-review'
import { FetchReviewsUseCase } from '@/domain/core/application/use-cases/fetch-review'
import { GetReviewUseCase } from '@/domain/core/application/use-cases/get-review'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { TogglePlaceReactionUseCase } from '@/domain/core/application/use-cases/toggle-place-reaction'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { EditUserController } from './controllers/edit-user.controller'
import { DeleteAccountController } from './controllers/delete-account.controller'
import { FetchPlacesByFilterController } from './controllers/fetch-places-by-filter.controller'
import { GetPlaceController } from './controllers/get-place.controller'
import { CreatePlaceController } from './controllers/create-place.controller'
import { EditPlaceController } from './controllers/edit-place.controller'
import { DeletePlaceController } from './controllers/delete-place.controller'
import { UploadAndCreateAttachmentController } from './controllers/upload-and-create-attachment.controller'
import { CreateReviewController } from './controllers/create-review.controller'
import { DeleteReviewController } from './controllers/delete-review.controller'
import { FetchReviewsController } from './controllers/fetch-reviews.controller'
import { GetReviewController } from './controllers/get-review.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
import { TogglePlaceReactionController } from './controllers/toggle-place-reaction.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule, MailModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    EditUserController,
    DeleteAccountController,
    FetchPlacesByFilterController,
    GetPlaceController,
    CreatePlaceController,
    EditPlaceController,
    DeletePlaceController,
    UploadAndCreateAttachmentController,
    CreateReviewController,
    DeleteReviewController,
    FetchReviewsController,
    GetReviewController,
    ReadNotificationController,
    TogglePlaceReactionController
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetProfileUseCase,
    EditUserUseCase,
    DeleteAccountUseCase,
    FetchPlacesByFilterUseCase,
    GetPlaceUseCase,
    CreatePlaceUseCase,
    EditPlaceUseCase,
    DeletePlaceUseCase,
    UploadAndCreateAttachmentUseCase,
    CreateReviewUseCase,
    DeleteReviewUseCase,
    FetchReviewsUseCase,
    GetReviewUseCase,
    ReadNotificationUseCase,
    TogglePlaceReactionUseCase
  ]
})
export class HttpModule { }