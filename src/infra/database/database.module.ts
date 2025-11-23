import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

import { UsersRepository } from '@/domain/core/application/repositories/users-repository'
import { PlacesRepository } from '@/domain/core/application/repositories/places-repository'
import { PlaceAttachmentsRepository } from '@/domain/core/application/repositories/place-attachments-repository'
import { AttachmentsRepository } from '@/domain/core/application/repositories/attachments-repository'
import { ReviewAttachmentsRepository } from '@/domain/core/application/repositories/review-attachments-repository'
import { ReviewsRepository } from '@/domain/core/application/repositories/reviews-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository'
import { PrismaPlacesRepository } from './prisma/repositories/prisma-places-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments'
import { PrismaPlaceAttachmentsRepository } from './prisma/repositories/prisma-place-attachments-repository'
import { PrismaReviewAttachmentsRepository } from './prisma/repositories/prisma-review-attachments-repository'
import { PrismaReviewsRepository } from './prisma/repositories/prisma-reviews-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },
    {
      provide: PlacesRepository,
      useClass: PrismaPlacesRepository
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository
    },
    {
      provide: PlaceAttachmentsRepository,
      useClass: PrismaPlaceAttachmentsRepository
    },
    {
      provide: ReviewAttachmentsRepository,
      useClass: PrismaReviewAttachmentsRepository
    },
    {
      provide: ReviewsRepository,
      useClass: PrismaReviewsRepository
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    PlacesRepository,
    AttachmentsRepository,
    PlaceAttachmentsRepository,
    ReviewAttachmentsRepository,
    ReviewsRepository,
    NotificationsRepository
  ]
})
export class DatabaseModule { }